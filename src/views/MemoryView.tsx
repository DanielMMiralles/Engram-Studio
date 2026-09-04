import React from 'react';
import { BrainCircuit, Clock, ShieldAlert, Award } from 'lucide-react';

export const MemoryView: React.FC = () => {
  const decisions = [
    { title: 'Decision: Migracion a Django 6.0 en Narval-SGN', date: '2026-08-15', tags: ['#narval', '#django6'] },
    { title: 'Decision: Estandarizacion de BDD con OpenSpec', date: '2026-07-20', tags: ['#sdd', '#specs'] },
    { title: 'Decision: Separacion de microservicios en Chambita API', date: '2026-06-10', tags: ['#nestjs', '#microservices'] },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-accent-purple" />
          Memoria Persistente (Engram System)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Registro perpetuo de decisiones arquitectónicas y lecciones aprendidas entre sesiones de IA.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {decisions.map((d, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-surface border border-border flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-accent-purple" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xs text-white">{d.title}</div>
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{d.date}</span>
                {d.tags.map(t => (
                  <span key={t} className="text-gray-400">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
