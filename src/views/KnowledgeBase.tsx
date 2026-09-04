import React, { useState } from 'react';
import { BookOpen, Search, Tag, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KnowledgeBase: React.FC = () => {
  const { lang, setSelectedNode, setActiveTab, graphData } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');

  const categories = [
    { id: 'all', label: `Todas (${graphData.nodes.length})` },
    { id: 'patrones', label: 'Patrones de Arquitectura' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'conocimiento', label: 'Conocimiento General' },
    { id: 'infra', label: 'DevOps & Docker' },
    { id: 'proyectos', label: 'Proyectos' }
  ];

  const displayedNotes = graphData.nodes.filter(node => {
    const matchesCat = activeCategory === 'all' || node.category === activeCategory;
    const matchesQuery = !filterQuery || node.label.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Base de Conocimiento de tu Almacén
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {graphData.nodes.length} notas y conceptos indexados desde tu Vault de Obsidian.
          </p>
        </div>

        {/* Filter Input */}
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-1.5 focus-within:border-primary">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtrar notas..."
            className="bg-transparent text-xs text-gray-200 placeholder-gray-500 focus:outline-none w-44"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-primary/20 text-primary-light border border-primary/30'
                : 'text-gray-400 hover:text-white hover:bg-surface'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedNotes.slice(0, 48).map((note, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedNode(note);
              setActiveTab('graph');
            }}
            className="p-4 rounded-xl bg-surface border border-border hover:border-primary/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <span 
                className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${note.color || '#58a6ff'}20`, color: note.color || '#58a6ff' }}
              >
                {note.category}
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-primary-light transition-all" />
            </div>
            <h3 className="font-semibold text-sm text-gray-200 group-hover:text-white truncate">
              {note.label}
            </h3>
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-1">
              <span>{note.val || 5} sinapsis</span>
              <span className="text-primary-light group-hover:underline">Explorar &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
