import React from 'react';
import { X, ExternalLink, Tag, Network, FileText, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotePreview: React.FC = () => {
  const { selectedNode, setSelectedNode, selectedNoteContent, lang } = useApp();

  if (!selectedNode) return null;

  const handleOpenObsidian = () => {
    const uri = `obsidian://open?vault=Obsidian%20Vault&file=${encodeURIComponent(selectedNode.label)}`;
    if ((window as any).devbrainApi) {
      (window as any).devbrainApi.openExternal(uri);
    } else {
      window.open(uri, '_blank');
    }
  };

  return (
    <div className="w-96 bg-surface border-l border-border h-full flex flex-col z-20 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between bg-surface-light/30">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}>
            {selectedNode.category}
          </span>
          <h2 className="font-bold text-base text-white mt-2 leading-snug">
            {selectedNode.label}
          </h2>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-light transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between text-xs bg-background/50">
        <button
          onClick={handleOpenObsidian}
          className="flex items-center gap-1.5 text-primary-light hover:underline text-xs"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          {lang === 'es' ? 'Abrir en Obsidian' : 'Open in Obsidian'}
        </button>
        <span className="text-[11px] text-gray-500 font-mono">
          {selectedNode.val} conexiones
        </span>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 overflow-y-auto font-sans text-xs text-gray-300 space-y-4 leading-relaxed">
        {selectedNoteContent ? (
          <div className="p-3.5 rounded-lg bg-surface-light border border-border space-y-2">
            <div className="flex items-center gap-2 text-primary font-medium text-xs border-b border-border/60 pb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Contenido del Markdown</span>
            </div>
            <div className="whitespace-pre-wrap font-mono text-[11px] text-gray-200 leading-relaxed max-h-96 overflow-y-auto pr-1 select-text">
              {selectedNoteContent}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-surface-light border border-border space-y-2">
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>{lang === 'es' ? 'Detalles de la Neurona' : 'Neuron Details'}</span>
            </div>
            <p className="text-gray-300">
              Esta nota técnica forma parte del núcleo de conocimiento de tu almacén. Conectada activamente a través de enlaces bidireccionales y categorizada en el grafo.
            </p>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-accent-purple" />
            Tags & Conceptos
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {['#arquitectura', '#patron', '#clean-code', '#mcp-core'].map(t => (
              <span key={t} className="px-2 py-0.5 rounded bg-surface-light text-gray-300 border border-border text-[11px]">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-accent-cyan" />
            {lang === 'es' ? 'Sinapsis Directas' : 'Direct Synapses'}
          </h3>
          <div className="space-y-1.5">
            {['[[Clean Architecture]]', '[[Domain Driven Design]]', '[[CQRS]]'].map(link => (
              <div key={link} className="px-2.5 py-1.5 rounded bg-background border border-border text-primary-light hover:border-primary transition-all cursor-pointer">
                {link}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
