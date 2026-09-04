import React from 'react';
import { 
  Network, 
  FolderKanban, 
  BrainCircuit, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { setActiveTab, lang } = useApp();

  const metrics = [
    { title: 'Neuronas Indexadas', value: '1,682', subtitle: '+14 esta semana', icon: Network, color: 'text-primary-light', bg: 'bg-primary/10' },
    { title: 'Proyectos Monitoreados', value: '8', subtitle: 'Narval, AliaLog, Chambita...', icon: FolderKanban, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
    { title: 'Herramientas MCP', value: '11', subtitle: 'OpenSpec, RAG, Health, Packager', icon: Cpu, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { title: 'Decisiones en Memoria', value: '47', subtitle: 'Guardadas en Engram', icon: BrainCircuit, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-background space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-surface to-surface-light border border-border overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary-light text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Engram Studio v2.0
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bienvenido a tu Centro de Inteligencia y Conocimiento
          </h1>
          <p className="text-sm text-gray-400">
            Conexión directa entre tus repositorios locales en desarrollo, el almacén de Obsidian y tus proveedores de IA preferidos.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('graph')}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
            >
              <Network className="w-4 h-4" />
              Explorar Grafo Neuronal
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="px-4 py-2 bg-surface-light hover:bg-border text-gray-200 border border-border rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-accent-purple" />
              Iniciar Chat con MCP
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-5 rounded-xl bg-surface border border-border hover:border-gray-600 transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">{m.title}</span>
                <div className={`p-2 rounded-lg ${m.bg}`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-mono">{m.value}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{m.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Flagship Projects & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monitored Projects */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-accent-orange" />
              Proyectos Insignia Monitoreados
            </h2>
            <button onClick={() => setActiveTab('projects')} className="text-xs text-primary-light hover:underline flex items-center gap-1">
              Ver todos <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Narval-SGN', stack: 'Django 6.0, DRF, PostgreSQL', status: 'Activo' },
              { name: 'AliaLog-System', stack: 'NestJS, TypeScript, React', status: 'Activo' },
              { name: 'Chambita-Ecosystem', stack: 'NestJS, React Native Expo', status: 'Activo' },
              { name: 'Mayan-EDMS', stack: 'Django, Docker, Python', status: 'Activo' },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface-light border border-border/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-gray-200">{p.name}</div>
                  <div className="text-gray-500 text-[11px]">{p.stack}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/20 text-[10px] font-semibold">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MCP Health & Quick Actions */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-green" />
            Estado del Servidor MCP
          </h2>
          <div className="p-4 rounded-lg bg-surface-light border border-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Transporte MCP:</span>
              <span className="text-gray-200 font-mono">stdio JSON-RPC (2024-11-05)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Modo de Despliegue:</span>
              <span className="text-accent-cyan font-mono font-medium">Contenerizado (Docker) / Local</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Dependencias Externas:</span>
              <span className="text-accent-green font-medium">0 (100% Python Standard Library)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
