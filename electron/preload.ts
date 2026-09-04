import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('devbrainApi', {
  scanVault: (vaultPath?: string) => ipcRenderer.invoke('vault:scan', vaultPath),
  readNote: (notePath: string) => ipcRenderer.invoke('vault:read-note', notePath),
  listTools: () => ipcRenderer.invoke('mcp:list-tools'),
  callTool: (name: string, args: any) => ipcRenderer.invoke('mcp:call-tool', { name, args }),
  chat: (payload: any) => ipcRenderer.invoke('llm:chat', payload),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),
  openExternal: (url: string) => ipcRenderer.invoke('shell:open', url),
  selectDirectory: () => ipcRenderer.invoke('dialog:select-directory'),
});
