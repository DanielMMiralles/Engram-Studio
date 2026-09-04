import React, { useState } from 'react';
import { BookOpen, Search, Tag, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KnowledgeBase: React.FC = () => {
  const { lang, setSelectedNode, setActiveTab } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todas (~1,617)' },
    { id: 'patrones', label: 'Patrones de Arquitectura' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'databases', label: 'Bases de Datos & SQL' },
    { id: 'devops-infra', label: 'DevOps & Docker' },
  ];

  const sampleNotes = [
    { title: 'CQRS & Event Sourcing Architecture', category: 'patrones', tags: ['#cqrs', '#event-sourcing', '#ddd'] },
    { title: 'Domain-Driven Design Tactical Patterns', category: 'patrones', tags: ['#ddd', '#entities', '#aggregates'] },
    { title: 'Django 6.0 Async ORM & Signals', category: 'backend', tags: ['#django', '#python', '#orm'] },
    { title: 'NestJS Modular Architecture & Guards', category: 'backend', tags: ['#nestjs', '#typescript', '#clean-arch'] },
    { title: 'PostgreSQL Vector Search (pgvector)', category: 'databases', tags: ['#postgresql', '#vector', '#rag'] },
    { title: 'Docker Multi-Stage Builds & Hardening', category: 'devops-infra', tags: ['#docker', '#security', '#alpine'] },
    { title: 'LangGraph StateGraph & Multi-Agent Loop', category: 'backend', tags: ['#langgraph', '#agents', '#python'] },
    { title: 'Spec-Driven Development (OpenSpec)', category: 'patrones', tags: ['#sdd', '#bdd', '#contracts'] },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Base de Conocimiento de DevBrain
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          1,617 notas curadas estructuradas en Obsidian.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
        {sampleNotes.map((note, idx) => (
          <div
            key={idx}
            onClick={() => {
              setSelectedNode({ id: note.title, label: note.title, category: note.category as any, val: 5 });
              setActiveTab('graph');
            }}
            className="p-4 rounded-xl bg-surface border border-border hover:border-primary/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary-light">
                {note.category}
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-primary-light transition-all" />
            </div>
            <h3 className="font-semibold text-sm text-gray-200 group-hover:text-white">
              {note.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              {note.tags.map(t => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-light text-gray-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
