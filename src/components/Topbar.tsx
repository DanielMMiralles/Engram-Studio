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
      <div className="relative w-96 max-w-md">
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

        {/* LLM Model Selector with latest bleeding-edge models */}
        <div className="flex items-center gap-2 bg-surface-light border border-border rounded-lg px-2.5 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
          <span className="text-gray-400 text-[11px]">Modelo:</span>
          <select
            value={selectedProvider}
            onChange={(e: any) => setSelectedProvider(e.target.value)}
            className="bg-transparent text-gray-200 font-medium focus:outline-none cursor-pointer text-xs"
          >
            <optgroup label="Anthropic">
              <option value="claude" className="bg-surface text-gray-200">Claude 3.7 Sonnet (Hybrid Reasoning)</option>
            </optgroup>
            <optgroup label="Google">
              <option value="gemini" className="bg-surface text-gray-200">Gemini 3.1 Pro (Ultra)</option>
            </optgroup>
            <optgroup label="OpenAI">
              <option value="openai" className="bg-surface text-gray-200">GPT-4.5 Preview / o3-mini</option>
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
