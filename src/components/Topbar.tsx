import React from 'react';
import { Search, Globe, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Topbar: React.FC = () => {
  const { 
    selectedProvider, setSelectedProvider, 
    searchQuery, setSearchQuery, 
    loadVaultData, isLoadingGraph,
    lang, setLang 
  } = useApp();

  return (
    <header className="h-14 bg-surface border-b border-border px-4 flex items-center justify-between select-none">
      {/* Search Input */}
      <div className="relative w-80 max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'es' ? 'Buscar neuronas, conceptos, notas...' : 'Search neurons, notes...'}
          className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Sync Button */}
        <button
          onClick={loadVaultData}
          disabled={isLoadingGraph}
          title={lang === 'es' ? 'Re-escanear Vault' : 'Re-scan Vault'}
          className="p-2 rounded-lg bg-surface-light border border-border text-gray-300 hover:text-white hover:border-gray-500 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGraph ? 'animate-spin text-primary' : ''}`} />
        </button>

        {/* Frontier Model Selector */}
        <div className="flex items-center gap-2 bg-surface-light border border-border rounded-lg px-2.5 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
          <span className="text-gray-400 text-[11px]">Modelo:</span>
          <select
            value={selectedProvider}
            onChange={(e: any) => setSelectedProvider(e.target.value)}
            className="bg-transparent text-gray-200 font-medium focus:outline-none cursor-pointer text-xs max-w-[280px]"
          >
            <optgroup label="Anthropic (Claude Series)">
              <option value="claude:claude-fable-5-1" className="bg-surface text-gray-200">Claude Fable 5.1 (Mythos Flagship)</option>
              <option value="claude:claude-opus-5" className="bg-surface text-gray-200">Claude Opus 5 (Agentic Heavy)</option>
              <option value="claude:claude-sonnet-5" className="bg-surface text-gray-200">Claude Sonnet 5 (Balanced Pro)</option>
              <option value="claude:claude-opus-4-8" className="bg-surface text-gray-200">Claude Opus 4.8</option>
              <option value="claude:claude-opus-4-6" className="bg-surface text-gray-200">Claude Opus 4.6</option>
              <option value="claude:claude-haiku-4-5" className="bg-surface text-gray-200">Claude Haiku 4.5 (Fast)</option>
            </optgroup>

            <optgroup label="OpenAI (GPT-5.6 / GPT-6 Tiers)">
              <option value="openai:gpt-5.6-sol" className="bg-surface text-gray-200">GPT-5.6 Sol (Flagship Reasoning)</option>
              <option value="openai:gpt-5.6-terra" className="bg-surface text-gray-200">GPT-5.6 Terra (Balanced)</option>
              <option value="openai:gpt-5.6-luna" className="bg-surface text-gray-200">GPT-5.6 Luna (Ultra Fast)</option>
              <option value="openai:gpt-6-astra" className="bg-surface text-gray-200">GPT-6 Astra (Frontier Preview)</option>
              <option value="openai:o3-mini" className="bg-surface text-gray-200">OpenAI o3-mini</option>
            </optgroup>

            <optgroup label="Google (Gemini 3.5 - 3.8 Frontier)">
              <option value="gemini:gemini-3.8-flash" className="bg-surface text-gray-200">Gemini 3.8 Flash (Latest Agentic Flagship)</option>
              <option value="gemini:gemini-3.8-flash-cyber" className="bg-surface text-gray-200">Gemini 3.8 Flash Cyber (Security & Code)</option>
              <option value="gemini:gemini-3.7-flash" className="bg-surface text-gray-200">Gemini 3.7 Flash (Coding Milestone)</option>
              <option value="gemini:gemini-3.6-flash" className="bg-surface text-gray-200">Gemini 3.6 Flash (Software Engineering)</option>
              <option value="gemini:gemini-3.5-pro" className="bg-surface text-gray-200">Gemini 3.5 Pro (Deep Reasoning)</option>
              <option value="gemini:gemini-3.5-flash" className="bg-surface text-gray-200">Gemini 3.5 Flash (Agentic Base)</option>
              <option value="gemini:gemini-3.1-pro-preview" className="bg-surface text-gray-200">Gemini 3.1 Pro Preview</option>
            </optgroup>

            <optgroup label="Modelos Chinos (Frontier Trillion MoE)">
              <option value="deepseek:deepseek-v4-pro" className="bg-surface text-gray-200">DeepSeek-V4-Pro (1.6T MoE)</option>
              <option value="deepseek:deepseek-r1" className="bg-surface text-gray-200">DeepSeek-R1 (CoT Reasoning)</option>
              <option value="qwen:qwen-3.8-max" className="bg-surface text-gray-200">Alibaba Qwen3.8-Max (2.4T)</option>
              <option value="kimi:kimi-k3" className="bg-surface text-gray-200">Moonshot Kimi K3 (2.8T Multimodal)</option>
              <option value="glm:glm-5.3" className="bg-surface text-gray-200">Z.ai GLM-5.3 (Agent & Tool-Use)</option>
            </optgroup>
          </select>
        </div>

        {/* Language Switch */}
        <button
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-light border border-border text-xs text-gray-300 hover:text-white transition-all font-mono"
        >
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>{lang.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
};
