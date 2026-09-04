import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, ExternalLink, Code, Layers, CheckCircle2, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectItem } from '../types';

export const ProjectsView: React.FC = () => {
  const { vaultPath, setActiveTab, setSelectedNode } = useApp();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        if ((window as any).devbrainApi) {
          const list = await (window as any).devbrainApi.listProjects();
          if (list && list.length > 0) {
            setProjects(list);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Error loading projects:', e);
      }

      // Educational / Clean Template sample projects
      setProjects([
        {
          name: 'Template-Service-Core',
          path: '02-PROYECTOS/Template-Service-Core',
          stack: ['TypeScript', 'Node.js', 'Docker', 'Clean Architecture'],
          status: 'Activo',
          description: 'Plantilla de microservicio basada en Clean Architecture y OpenSpec SDD.',
          hasDocker: true
        },
        {
          name: 'AI-Agent-Runner',
          path: '02-PROYECTOS/AI-Agent-Runner',
          stack: ['Python', 'FastAPI', 'Docker', 'MCP Protocol'],
          status: 'Activo',
          description: 'Servicio de ejecución y orquestación de agentes con soporte MCP nativo.',
          hasDocker: true
        }
      ]);
      setIsLoading(false);
    };

    fetchProjects();
  }, [vaultPath]);

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

      {projects.length === 0 ? (
        <div className="p-8 rounded-2xl bg-surface border border-dashed border-border text-center max-w-xl mx-auto space-y-3 my-12">
          <div className="w-12 h-12 rounded-2xl bg-surface-light border border-border flex items-center justify-center mx-auto text-primary-light">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-white">
            Sin proyectos detectados aún
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Crea subcarpetas en tu carpeta <code className="text-primary-light bg-background px-1.5 py-0.5 rounded">02-PROYECTOS</code> dentro de tu almacén de Obsidian para verlos organizados aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-accent-orange/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-accent-green font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {proj.status}
                  </span>
                  {proj.hasDocker && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      Docker
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-accent-orange transition-all">
                  {proj.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-surface-light border border-border text-gray-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => {
                      setSelectedNode({
                        id: proj.name,
                        label: proj.name,
                        category: 'proyectos',
                        val: 8,
                        color: '#f0883e'
                      });
                      setActiveTab('graph');
                    }}
                    className="text-primary-light hover:underline text-[11px] flex items-center gap-1"
                  >
                    Ver en Grafo Neuronal &rarr;
                  </button>
                  <button
                    onClick={() => {
                      const uri = `obsidian://open?vault=Obsidian%20Vault&file=${encodeURIComponent(proj.name)}`;
                      if ((window as any).devbrainApi) {
                        (window as any).devbrainApi.openExternal(uri);
                      }
                    }}
                    className="p-1 rounded text-gray-500 hover:text-white transition-all"
                    title="Abrir carpeta en Obsidian"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
