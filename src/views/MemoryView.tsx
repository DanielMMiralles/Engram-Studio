import React, { useState, useEffect } from 'react';
import { BrainCircuit, Award, Clock, FileText, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MemoryItem {
  title: string;
  date: string;
  summary: string;
  path: string;
}

export const MemoryView: React.FC = () => {
  const { vaultPath, setSelectedNode, setActiveTab } = useApp();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true);
      try {
        if ((window as any).devbrainApi) {
          const list = await (window as any).devbrainApi.listMemories();
          if (list && list.length > 0) {
            setMemories(list);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Error fetching memories:', e);
      }

      // Default educational ADR templates
      setMemories([
        {
          title: 'ADR-001: Adopción de Clean Architecture y DDD',
          date: '2026-08-15',
          summary: 'Se establece la separación estricta entre Dominio, Casos de Uso, Adaptadores e Infraestructura para desacoplar el core del framework.',
          path: ''
        },
        {
          title: 'ADR-002: Estandarización de Especificaciones con OpenSpec (SDD)',
          date: '2026-08-28',
          summary: 'Definición de contratos formales, escenarios BDD Given/When/Then y validación previa antes de generar código con IA.',
          path: ''
        },
        {
          title: 'ADR-003: Almacenamiento Local Aislado y BYOK Zero-Leak',
          date: '2026-09-02',
          summary: 'Garantía de privacidad total mediante claves BYOK y lectura directa del sistema de archivos local sin servidores intermediarios.',
          path: ''
        }
      ]);
      setIsLoading(false);
    };

    fetchMemories();
  }, [vaultPath]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-accent-purple" />
            Memoria Persistente (Engram)
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Registro perpetuo de tus decisiones arquitectónicas (ADRs) y aprendizajes acumulados entre sesiones de IA.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {memories.map((mem, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-surface border border-border hover:border-accent-purple/50 transition-all space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-accent-purple bg-accent-purple/10 px-2.5 py-0.5 rounded-full border border-accent-purple/20">
                {mem.date}
              </span>
              {mem.path && (
                <button
                  onClick={() => {
                    const uri = `obsidian://open?vault=Obsidian%20Vault&file=${encodeURIComponent(mem.title)}`;
                    if ((window as any).devbrainApi) {
                      (window as any).devbrainApi.openExternal(uri);
                    }
                  }}
                  className="text-gray-500 hover:text-white p-1 rounded transition-all"
                  title="Abrir en Obsidian"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-accent-purple transition-all">
              {mem.title}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed">
              {mem.summary}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setSelectedNode({
                    id: mem.title,
                    label: mem.title,
                    category: 'aprendizajes',
                    val: 7,
                    color: '#a371f7',
                    path: mem.path
                  });
                  setActiveTab('graph');
                }}
                className="text-primary-light hover:underline text-[11px] flex items-center gap-1"
              >
                Localizar en Grafo Neuronal &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
