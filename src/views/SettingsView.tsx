import React from 'react';
import { Settings, Key, HardDrive, Globe, Server } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { vaultPath, setVaultPath, lang, setLang } = useApp();

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          Configuración de Engram Studio
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Gestiona tus rutas, proveedores de IA y servidores MCP.
        </p>
      </div>

      {/* Vault Path */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          Ruta del Almacén de Obsidian (Vault)
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={vaultPath}
            onChange={(e) => setVaultPath(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
          />
          <button className="px-3 py-2 bg-surface-light border border-border rounded-lg text-xs text-gray-300 hover:text-white">
            Examinar...
          </button>
        </div>
      </div>

      {/* LLM API Keys */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-accent-purple" />
          Claves de API de Proveedores (BYOK)
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Anthropic (Claude API Key)</label>
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">OpenAI API Key</label>
            <input
              type="password"
              placeholder="sk-proj-..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Google Gemini API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* MCP Mode */}
      <div className="p-5 rounded-xl bg-surface border border-border space-y-3">
        <h2 className="font-bold text-sm text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-accent-cyan" />
          Modo del Servidor MCP
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-surface-light border border-primary/40 text-xs space-y-1">
            <div className="font-semibold text-white">Docker Container (Recomendado)</div>
            <div className="text-gray-400 text-[11px]">devbrain/mcp-server:latest</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-light border border-border text-xs space-y-1">
            <div className="font-semibold text-gray-300">Python Local (Directo)</div>
            <div className="text-gray-400 text-[11px]">python src/devbrain_mcp.py</div>
          </div>
        </div>
      </div>
    </div>
  );
};
