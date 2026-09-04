import React from 'react';
import { FolderKanban, GitBranch, Cpu, Package, CheckCircle2 } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const projects = [
    {
      name: 'Narval-SGN',
      description: 'Sistema de Gestion Naviera y Portuaria de mision critica.',
      stack: ['Django 6.0', 'DRF', 'PostgreSQL', 'Docker', 'NLP/OCR'],
      path: 'C:/Users/damm1/OneDrive/Escritorio/Narval-SGN/backend',
      status: 'activo'
    },
    {
      name: 'AliaLog-System',
      description: 'Plataforma logistica integral con arquitectura modular y Clean Architecture.',
      stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'React'],
      path: 'C:/Users/damm1/OneDrive/Escritorio/alia-log-api',
      status: 'activo'
    },
    {
      name: 'Chambita-Ecosystem',
      description: 'Marketplace de servicios y aplicacion movil con backend NestJS y app Expo.',
      stack: ['NestJS', 'React Native', 'Expo', 'PostgreSQL'],
      path: 'C:/Users/damm1/OneDrive/Escritorio/Chambita',
      status: 'activo'
    },
    {
      name: 'Mayan-EDMS',
      description: 'Gestor documental empresarial de codigo abierto basado en Django.',
      stack: ['Django', 'Python', 'Docker'],
      path: 'C:/Users/damm1/mayan-edms',
      status: 'activo'
    }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-accent-orange" />
          Proyectos Insignia Monitoreados
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Repositorios sincronizados automáticamente con el radar de DevBrain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-surface border border-border space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.description}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20 text-[10px] font-semibold">
                {p.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {p.stack.map(s => (
                <span key={s} className="px-2 py-0.5 rounded bg-surface-light border border-border text-[11px] text-gray-300">
                  {s}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span className="truncate max-w-[280px]">{p.path}</span>
              <button className="text-primary-light hover:underline font-sans text-xs">
                Empaquetar Contexto
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
