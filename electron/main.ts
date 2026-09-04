import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;
const DEFAULT_VAULT = process.env.VAULT_DIR || 'C:\\Users\\damm1\\OneDrive\\Documentos\\Obsidian Vault';

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

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handler: Scan Vault and build Neural Graph
ipcMain.handle('vault:scan', async (_, customVaultPath?: string) => {
  const vaultPath = customVaultPath || DEFAULT_VAULT;
  const nodes: any[] = [];
  const links: any[] = [];
  const nodeSet = new Set<string>();

  if (!fs.existsSync(vaultPath)) {
    return { nodes: [], links: [] };
  }

  // Scan Knowledge Base directory
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
            let color = '#388bfd'; // default blue
            if (category.includes('patron')) color = '#58a6ff';
            else if (category.includes('backend')) color = '#2ea043';
            else if (category.includes('devops') || category.includes('infra')) color = '#39c5bb';
            else if (category.includes('database')) color = '#a371f7';

            nodes.push({
              id,
              label: stem,
              category,
              color,
              val: 3,
              path: fullPath
            });

            // Extract wikilinks [[Target]]
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const matches = content.match(/\[\[(.*?)\]\]/g);
              if (matches) {
                for (const m of matches) {
                  const target = m.replace(/^\[\[/, '').replace(/\]\]$/, '').split('|')[0].trim();
                  links.push({ source: id, target, color: 'rgba(56, 139, 253, 0.25)' });
                }
              }
            } catch (e) {}
          }
        }
      }
    };
    scanDir(kbDir, 'conocimiento');
  }

  // Also add Flagship Projects as prominent Hub Nodes
  const projsDir = path.join(vaultPath, '02-PROYECTOS');
  if (fs.existsSync(projsDir)) {
    const entries = fs.readdirSync(projsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !['specs', '_templates', 'context-bundles'].includes(entry.name)) {
        nodes.push({
          id: entry.name,
          label: entry.name,
          category: 'proyectos',
          color: '#f0883e', // Orange hub
          val: 8,
          path: path.join(projsDir, entry.name, 'README.md')
        });
        nodeSet.add(entry.name);
      }
    }
  }

  // Filter links to only connect existing nodes
  const validLinks = links.filter(l => nodeSet.has(l.source) && nodeSet.has(l.target));

  return { nodes, links: validLinks };
});

// IPC Handler: Read Note Markdown
ipcMain.handle('vault:read-note', async (_, notePath: string) => {
  if (fs.existsSync(notePath)) {
    return fs.readFileSync(notePath, 'utf-8');
  }
  return '# Nota no encontrada\nEl archivo especificado no existe en el disco.';
});

// IPC Handler: Open External (or Obsidian URI)
ipcMain.handle('shell:open', async (_, url: string) => {
  await shell.openExternal(url);
});

// IPC Handler: Directory Picker Dialog
ipcMain.handle('dialog:select-directory', async () => {
  if (!mainWindow) return null;
  const res = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Seleccionar Almacén de Obsidian (Vault)'
  });
  return res.canceled ? null : res.filePaths[0];
});
