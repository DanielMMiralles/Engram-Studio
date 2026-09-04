import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';

export class VaultWatcher {
  private watcher: fs.FSWatcher | null = null;
  private debounceTimers = new Map<string, NodeJS.Timeout>();

  constructor(private getWindow: () => BrowserWindow | null) {}

  public start(vaultPath: string) {
    this.stop();

    if (!vaultPath || !fs.existsSync(vaultPath)) {
      console.log('[VaultWatcher] Path does not exist:', vaultPath);
      return;
    }

    console.log('[VaultWatcher] Starting native recursive watcher on:', vaultPath);
    try {
      this.watcher = fs.watch(vaultPath, { recursive: true }, (eventType, filename) => {
        if (!filename || !filename.endsWith('.md')) return;

        // Debounce to prevent multiple events on rapid writes
        const existingTimer = this.debounceTimers.get(filename);
        if (existingTimer) clearTimeout(existingTimer);

        this.debounceTimers.set(
          filename,
          setTimeout(() => {
            this.debounceTimers.delete(filename);
            this.handleFileChange(vaultPath, filename, eventType);
          }, 350)
        );
      });
    } catch (err) {
      console.warn('[VaultWatcher] Error starting watch:', err);
    }
  }

  private handleFileChange(vaultPath: string, relativePath: string, eventType: string) {
    const fullPath = path.join(vaultPath, relativePath);
    const win = this.getWindow();
    if (!win) return;

    if (!fs.existsSync(fullPath)) {
      // File was deleted
      const stem = path.basename(relativePath, '.md');
      win.webContents.send('vault:node-deleted', { id: stem });
      return;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const stem = path.basename(relativePath, '.md');
      
      // Determine category from folder
      const parts = relativePath.split(path.sep);
      let category = 'conocimiento';
      let color = '#388bfd';

      if (relativePath.includes('patron')) { category = 'patrones'; color = '#58a6ff'; }
      else if (relativePath.includes('backend')) { category = 'backend'; color = '#2ea043'; }
      else if (relativePath.includes('infra') || relativePath.includes('devops')) { category = 'infra'; color = '#39c5bb'; }
      else if (relativePath.includes('aprendizaj') || relativePath.includes('decision')) { category = 'aprendizajes'; color = '#a371f7'; }
      else if (relativePath.includes('02-PROYECTOS')) { category = 'proyectos'; color = '#f0883e'; }

      // Extract wikilinks
      const links: any[] = [];
      const matches = content.match(/\[\[(.*?)\]\]/g);
      if (matches) {
        for (const m of matches) {
          const target = m.replace(/^\[\[/, '').replace(/\]\]$/, '').split('|')[0].trim();
          links.push({ source: stem, target });
        }
      }

      const node = {
        id: stem,
        label: stem,
        category,
        color,
        val: 6,
        path: fullPath,
        isNew: true,
        birthTime: Date.now()
      };

      console.log(`[VaultWatcher] New/Updated neuron detected: ${stem} with ${links.length} links`);
      win.webContents.send('vault:node-added', { node, links });
    } catch (e) {
      console.warn('[VaultWatcher] Error reading changed file:', e);
    }
  }

  public stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
