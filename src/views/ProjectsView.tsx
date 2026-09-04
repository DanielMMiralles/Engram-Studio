import React from 'react';
import { FolderKanban, Plus, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProjectsView: React.FC = () => {
  const { vaultPath, setActiveTab } = useApp();

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-accent-orange" />
            Tus Proyectos Monitoreados
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Gestiona tus propios proyectos de software y especificaciones OpenSpec (SDD).
          </p>
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Configurar Proyectos en Vault
        </button>
      </div>

      <div className="p-8 rounded-2xl bg-surface border border-dashed border-border text-center max-w-xl mx-auto space-y-3 my-12">
        <div className="w-12 h-12 rounded-2xl bg-surface-light border border-border flex items-center justify-center mx-auto text-primary-light">
          <FolderKanban className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-sm text-white">
          Gestión Personal de Proyectos
        </h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Los proyectos se descubren automáticamente desde la subcarpeta <code className="text-primary-light bg-background px-1.5 py-0.5 rounded">02-PROYECTOS</code> dentro de tu propio almacén de Obsidian, o mediante tu archivo <code className="text-primary-light bg-background px-1.5 py-0.5 rounded">projects.json</code>.
        </p>
      </div>
    </div>
  );
};
