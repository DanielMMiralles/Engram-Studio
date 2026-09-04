import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  MessageSquareCode, 
  BookOpen, 
  FolderKanban, 
  BrainCircuit, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, lang, graphData } = useApp();

  const menuItems = [
    { id: 'dashboard', label: lang === 'es' ? 'Dashboard' : 'Dashboard', icon: LayoutDashboard },
    { id: 'graph', label: lang === 'es' ? 'Grafo Neuronal' : 'Brain Graph', icon: Network, badge: graphData.nodes.length },
    { id: 'chat', label: lang === 'es' ? 'Chat IA + MCP' : 'AI Chat + MCP', icon: MessageSquareCode, isNew: true },
    { id: 'knowledge', label: lang === 'es' ? 'Conocimiento' : 'Knowledge Base', icon: BookOpen },
    { id: 'projects', label: lang === 'es' ? 'Proyectos' : 'Projects', icon: FolderKanban },
    { id: 'memory', label: lang === 'es' ? 'Memoria (Engram)' : 'Memory (Engram)', icon: BrainCircuit },
    { id: 'settings', label: lang === 'es' ? 'Configuración' : 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-full select-none z-10">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-purple flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              DevBrain <span className="text-primary-light font-normal text-xs px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">Studio</span>
            </h1>
            <p className="text-[11px] text-gray-400">Knowledge & MCP Suite</p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary/15 text-primary-light border border-primary/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-surface-light'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-light' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-light text-gray-400 border border-border">
                  {item.badge}
                </span>
              )}
              {item.isNew && (
                <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-semibold uppercase">
                  <Sparkles className="w-2.5 h-2.5" /> LLM
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Vault Status */}
      <div className="p-3 border-t border-border bg-background/50">
        <div className="p-2.5 rounded-lg bg-surface-light/60 border border-border/80">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="font-medium text-gray-300">Obsidian Vault</span>
            <span className="text-accent-green flex items-center gap-1 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
              Sincronizado
            </span>
          </div>
          <p className="text-[10px] text-gray-500 truncate font-mono">
            ~1,682 neuronas indexadas
          </p>
        </div>
      </div>
    </aside>
  );
};
