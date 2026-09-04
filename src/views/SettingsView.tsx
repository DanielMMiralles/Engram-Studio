import React, { useState, useEffect } from 'react';
import { Settings, Key, HardDrive, Server, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { vaultPath, setVaultPath, loadVaultData } = useApp();
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [qwenKey, setQwenKey] = useState('');
  const [kimiKey, setKimiKey] = useState('');
  const [glmKey, setGlmKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if ((window as any).devbrainApi) {
      (window as any).devbrainApi.getSettings().then((s: any) => {
        if (s) {
          if (s.vaultPath) setVaultPath(s.vaultPath);
          if (s.anthropicKey) setAnthropicKey(s.anthropicKey);
          if (s.openaiKey) setOpenaiKey(s.openaiKey);
          if (s.geminiKey) setGeminiKey(s.geminiKey);
          if (s.deepseekKey) setDeepseekKey(s.deepseekKey);
          if (s.qwenKey) setQwenKey(s.qwenKey);
          if (s.kimiKey) setKimiKey(s.kimiKey);
          if (s.glmKey) setGlmKey(s.glmKey);
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
        geminiKey,
        deepseekKey,
        qwenKey,
        kimiKey,
        glmKey
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      loadVaultData();
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
            Gestiona tus rutas personales, claves de API (BYOK) y servidor MCP.
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
          Ruta de tu Almacén de Obsidian (Vault Personal)
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={vaultPath}
            onChange={(e) => setVaultPath(e.target.value)}
            placeholder="Selecciona o escribe la ruta a tu carpeta de Obsidian..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleBrowseVault}
            className="px-3 py-2 bg-surface-light border border-border rounded-lg text-xs text-gray-300 hover:text-white transition-all shrink-0"
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
        <p className="text-xs text-gray-400">
          Tus claves se guardan localmente en tu ordenador y nunca se comparten con nadie.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Anthropic (Claude Fable 5.1 / Opus 5 / Sonnet 5 / Opus 4.8 / 4.6)</label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">OpenAI (GPT-5.6 Sol / Terra / Luna / GPT-6 Astra)</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Google Gemini (Gemini 3.8 Flash / 3.7 / 3.6 / 3.5 Pro / 3.1 Pro)</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <h3 className="text-xs font-semibold text-accent-cyan uppercase tracking-wider mb-2">
              Modelos Chinos Frontier (MoE Trillion Tiers)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">DeepSeek (V4-Pro / R1)</label>
                <input
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Alibaba Qwen (Qwen3.8-Max)</label>
                <input
                  type="password"
                  value={qwenKey}
                  onChange={(e) => setQwenKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Moonshot Kimi (Kimi K3)</label>
                <input
                  type="password"
                  value={kimiKey}
                  onChange={(e) => setKimiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Z.ai GLM (GLM-5.3 Agentic)</label>
                <input
                  type="password"
                  value={glmKey}
                  onChange={(e) => setGlmKey(e.target.value)}
                  placeholder="API Key..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
