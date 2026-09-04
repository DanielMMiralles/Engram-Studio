import React, { useState, useEffect } from 'react';
import { Settings, Key, HardDrive, Server, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { vaultPath, setVaultPath, lang } = useApp();
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if ((window as any).devbrainApi) {
      (window as any).devbrainApi.getSettings().then((s: any) => {
        if (s) {
          if (s.vaultPath) setVaultPath(s.vaultPath);
          if (s.anthropicKey) setAnthropicKey(s.anthropicKey);
          if (s.openaiKey) setOpenaiKey(s.openaiKey);
          if (s.geminiKey) setGeminiKey(s.geminiKey);
        }
      });
    }
  }, []);

  const handleSave = async () => {
    if ((window as any).devbrainApi) {
      await (window as any).devbrainApi.saveSettings({
        vaultPath,
        anthropicKey,
        openaiKey,
        geminiKey
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleBrowseVault = async () => {
    if ((window as any).devbrainApi) {
      const selected = await (window as any).devbrainApi.selectDirectory();
      if (selected) {
        setVaultPath(selected);
      }
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Configuración de Engram Studio
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Gestiona tus rutas de almacenamiento, claves de API y servidor MCP.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-accent-green" /> : <Save className="w-4 h-4" />}
          {savedSuccess ? 'Guardado con éxito' : 'Guardar Ajustes'}
        </button>
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
          <button
            onClick={handleBrowseVault}
            className="px-3 py-2 bg-surface-light border border-border rounded-lg text-xs text-gray-300 hover:text-white transition-all"
          >
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
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
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
