import React from 'react';
import { BrainCircuit, Award, Clock } from 'lucide-react';

export const MemoryView: React.FC = () => {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-accent-purple" />
          Memoria Persistente (Engram)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Registro perpetuo de tus decisiones arquitectónicas y aprendizajes acumulados entre sesiones.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-surface border border-dashed border-border text-center max-w-xl mx-auto space-y-3 my-12">
        <div className="w-12 h-12 rounded-2xl bg-surface-light border border-border flex items-center justify-center mx-auto text-accent-purple">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-sm text-white">
          Tus Decisiones de Arquitectura
        </h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Cada vez que tú o tu modelo de IA utilicen la herramienta <code className="text-accent-purple bg-background px-1.5 py-0.5 rounded">remember_decision</code> o <code className="text-accent-purple bg-background px-1.5 py-0.5 rounded">log_learning</code>, se archivarán en tu carpeta personal <code className="text-accent-purple bg-background px-1.5 py-0.5 rounded">04-APRENDIZAJES/decisiones</code> para recordarlas permanentemente.
        </p>
      </div>
    </div>
  );
};
