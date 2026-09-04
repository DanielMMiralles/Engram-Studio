import React from 'react';
import { Terminal, Database, Activity, HardDrive } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Statusbar: React.FC = () => {
  const { graphData, vaultPath, lang } = useApp();

  return (
    <footer className="h-6 bg-background border-t border-border px-4 flex items-center justify-between text-[11px] text-gray-400 select-none z-20">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-accent-green font-medium">
          <span className="w-2 h-2 rounded-full bg-accent-green"></span>
          MCP Engine Ready
        </span>
        <span className="flex items-center gap-1">
          <Database className="w-3 h-3 text-gray-500" />
          {graphData.nodes.length} {lang === 'es' ? 'neuronas' : 'neurons'}
        </span>
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-gray-500" />
          {graphData.links.length} {lang === 'es' ? 'conexiones' : 'links'}
        </span>
        <span className="flex items-center gap-1">
          <Terminal className="w-3 h-3 text-gray-500" />
          11 herramientas activas
        </span>
      </div>

      <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500">
        <span className="flex items-center gap-1 text-gray-400">
          <HardDrive className="w-3 h-3 text-primary-light" />
          {vaultPath ? 'Vault Conectado' : 'Sin Vault Asignado'}
        </span>
        <span>UTF-8</span>
      </div>
    </footer>
  );
};
