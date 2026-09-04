import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('devbrainApi', {
  scanVault: (vaultPath?: string) => ipcRenderer.invoke('vault:scan', vaultPath),
  readNote: (notePath: string) => ipcRenderer.invoke('vault:read-note', notePath),
  listTools: () => ipcRenderer.invoke('mcp:list-tools'),
  callTool: (name: string, args: any) => ipcRenderer.invoke('mcp:call-tool', { name, args }),
  getProjects: () => ipcRenderer.invoke('projects:list'),
  openExternal: (url: string) => ipcRenderer.invoke('shell:open', url),
  selectDirectory: () => ipcRenderer.invoke('dialog:select-directory'),
});
