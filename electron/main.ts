import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { McpService } from './mcp-service';
import { LlmService } from './llm-service';
import { VaultWatcher } from './vault-watcher';

let mainWindow: BrowserWindow | null = null;
const mcpService = new McpService();
const llmService = new LlmService(mcpService);
const vaultWatcher = new VaultWatcher(() => mainWindow);

const SETTINGS_FILE = path.join(app.getPath('userData'), 'engram-settings.json');

function getSettings() {
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    } catch (e) {}
  }
  return {
    vaultPath: '',
    anthropicKey: '',
    openaiKey: '',
    geminiKey: '',
    deepseekKey: '',
    qwenKey: '',
    kimiKey: '',
    glmKey: '',
    defaultProvider: 'claude'
  };
}

function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  if (settings.vaultPath) {
    vaultWatcher.start(settings.vaultPath);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0d1117',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#161b22',
      symbolColor: '#8b949e',
      height: 38
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  createWindow();

  // Start background MCP server
  try {
    await mcpService.start();
    console.log('[Engram Studio] MCP server initialized and ready');
  } catch (e) {
    console.warn('[Engram Studio] MCP auto-start deferred:', e);
  }

  // Start live vault watcher if path configured
  const settings = getSettings();
  if (settings.vaultPath) {
    vaultWatcher.start(settings.vaultPath);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  mcpService.stop();
  vaultWatcher.stop();
  if (process.platform !== 'darwin') app.quit();
});

// IPC: Scan Vault
ipcMain.handle('vault:scan', async (_, customVaultPath?: string) => {
  const vaultPath = customVaultPath || getSettings().vaultPath;
  const nodes: any[] = [];
  const links: any[] = [];
  const nodeSet = new Set<string>();

  if (!vaultPath || !fs.existsSync(vaultPath)) {
    return { nodes: [], links: [] };
  }

  // Restart watcher on scanned path
  vaultWatcher.start(vaultPath);

  const kbDir = path.join(vaultPath, '03-CONOCIMIENTO');
  if (fs.existsSync(kbDir)) {
    const scanDir = (dir: string, category: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, entry.name);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const stem = entry.name.replace(/\.md$/, '');
          const id = stem;
          if (!nodeSet.has(id)) {
            nodeSet.add(id);
            let color = '#388bfd';
            if (category.includes('patron')) color = '#58a6ff';
            else if (category.includes('backend')) color = '#2ea043';
            else if (category.includes('devops') || category.includes('infra')) color = '#39c5bb';
            else if (category.includes('database')) color = '#a371f7';

            nodes.push({ id, label: stem, category, color, val: 3, path: fullPath });

            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const matches = content.match(/\[\[(.*?)\]\]/g);
              if (matches) {
                for (const m of matches) {
                  const target = m.replace(/^\[\[/, '').replace(/\]\]$/, '').split('|')[0].trim();
                  links.push({ source: id, target });
                }
              }
            } catch (e) {}
          }
        }
      }
    };
    scanDir(kbDir, 'conocimiento');
  }

  // Scan user projects in 02-PROYECTOS
  const projsDir = path.join(vaultPath, '02-PROYECTOS');
  if (fs.existsSync(projsDir)) {
    const entries = fs.readdirSync(projsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !['specs', '_templates', 'context-bundles'].includes(entry.name)) {
        nodes.push({
          id: entry.name,
          label: entry.name,
          category: 'proyectos',
          color: '#f0883e',
          val: 8,
          path: path.join(projsDir, entry.name, 'README.md')
        });
        nodeSet.add(entry.name);
      }
    }
  }

  const validLinks = links.filter(l => nodeSet.has(l.source) && nodeSet.has(l.target));
  return { nodes, links: validLinks };
});

// IPC: Read Note
ipcMain.handle('vault:read-note', async (_, notePath: string) => {
  if (fs.existsSync(notePath)) {
    return fs.readFileSync(notePath, 'utf-8');
  }
  return '# Nota no encontrada\nEl archivo especificado no existe en el disco.';
});

// IPC: List Projects
ipcMain.handle('vault:list-projects', async () => {
  const vaultPath = getSettings().vaultPath;
  if (!vaultPath || !fs.existsSync(vaultPath)) return [];

  const projsDir = path.join(vaultPath, '02-PROYECTOS');
  if (!fs.existsSync(projsDir)) return [];

  const projects: any[] = [];
  try {
    const entries = fs.readdirSync(projsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !['specs', '_templates', 'context-bundles'].includes(entry.name)) {
        const readmePath = path.join(projsDir, entry.name, 'README.md');
        let desc = 'Proyecto gestionado en tu almacén de Obsidian.';
        let stack = ['Architecture', 'Docs'];
        if (fs.existsSync(readmePath)) {
          try {
            const content = fs.readFileSync(readmePath, 'utf-8');
            const lines = content.split('\n');
            for (const line of lines) {
              const clean = line.trim();
              if (clean && !clean.startsWith('#')) {
                desc = clean.substring(0, 160);
                break;
              }
            }
            if (content.toLowerCase().includes('python') || content.toLowerCase().includes('django')) stack.push('Python');
            if (content.toLowerCase().includes('typescript') || content.toLowerCase().includes('react')) stack.push('TypeScript');
            if (content.toLowerCase().includes('docker')) stack.push('Docker');
            if (content.toLowerCase().includes('postgres') || content.toLowerCase().includes('sql')) stack.push('PostgreSQL');
          } catch (e) {}
        }
        projects.push({
          name: entry.name,
          path: path.join(projsDir, entry.name),
          stack: Array.from(new Set(stack)),
          status: 'Activo',
          description: desc,
          hasDocker: fs.existsSync(path.join(projsDir, entry.name, 'Dockerfile'))
        });
      }
    }
  } catch (e) {
    console.error('[Vault Projects Scan Error]:', e);
  }
  return projects;
});

// IPC: List Decisions & Memories
ipcMain.handle('vault:list-memories', async () => {
  const vaultPath = getSettings().vaultPath;
  if (!vaultPath || !fs.existsSync(vaultPath)) return [];

  const memories: any[] = [];
  const searchDirs = [
    path.join(vaultPath, '04-APRENDIZAJES', 'decisiones'),
    path.join(vaultPath, '04-APRENDIZAJES')
  ];

  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const f of files) {
          if (f.endsWith('.md')) {
            const fullPath = path.join(dir, f);
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');
            let summary = '';
            for (const l of lines) {
              const clean = l.trim();
              if (clean && !clean.startsWith('#')) {
                summary = clean.substring(0, 200);
                break;
              }
            }
            memories.push({
              title: f.replace(/\.md$/, ''),
              date: fs.statSync(fullPath).mtime.toISOString().split('T')[0],
              summary: summary || 'Registro de aprendizaje / decisión técnica en Engram.',
              path: fullPath
            });
          }
        }
      } catch (e) {}
    }
  }

  return memories;
});

// IPC: MCP Tools
ipcMain.handle('mcp:list-tools', async () => {
  await mcpService.start();
  return await mcpService.listTools();
});

ipcMain.handle('mcp:call-tool', async (_, { name, args }) => {
  await mcpService.start();
  return await mcpService.callTool(name, args);
});

// IPC: LLM Chat with Tool-Calling Loop
ipcMain.handle('llm:chat', async (_, payload) => {
  await mcpService.start();
  return await llmService.executeChat(payload);
});

// IPC: Settings Persistence
ipcMain.handle('settings:get', async () => getSettings());
ipcMain.handle('settings:save', async (_, settings) => {
  saveSettings(settings);
  return true;
});

// IPC: Shell & Dialog
ipcMain.handle('shell:open', async (_, url: string) => {
  await shell.openExternal(url);
});

ipcMain.handle('dialog:select-directory', async () => {
  if (!mainWindow) return null;
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Seleccionar Almacén de Obsidian (Vault)'
  });
  return res.canceled ? null : res.filePaths[0];
});
