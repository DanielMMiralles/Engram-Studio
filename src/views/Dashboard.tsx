import React from 'react';
import { 
  Network, 
  FolderKanban, 
  BrainCircuit, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { setActiveTab, graphData, vaultPath, lang } = useApp();

  const metrics = [
    { title: 'Neuronas en tu Almacén', value: graphData.nodes.length.toString(), subtitle: 'Notas y conceptos mapeados', icon: Network, color: 'text-primary-light', bg: 'bg-primary/10' },
    { title: 'Sinapsis / Enlaces', value: graphData.links.length.toString(), subtitle: 'Conexiones entre ideas', icon: BrainCircuit, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { title: 'Herramientas MCP', value: '11', subtitle: 'OpenSpec, RAG, Health, Packager', icon: Cpu, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { title: 'Estado del Almacén', value: vaultPath ? 'Conectado' : 'Pendiente', subtitle: vaultPath ? 'Sincronización activa' : 'Configura tu ruta en Ajustes', icon: FolderKanban, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
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
            Tu Cerebro Digital de Conocimiento y Desarrollo
          </h1>
          <p className="text-sm text-gray-400">
            Gestiona tu propio almacén de notas de Obsidian, visualiza tus conexiones neuronales y conecta con los modelos de IA más avanzados sin intermediarios.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('graph')}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
            >
              <Network className="w-4 h-4" />
              Ver Grafo Neuronal
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-surface-light hover:bg-border text-gray-200 border border-border rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <FolderKanban className="w-4 h-4 text-accent-orange" />
              Configurar Mi Almacén
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

      {/* Two Column Layout: Quick Guides & MCP Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-accent-purple" />
            Flujo de Trabajo Personal
          </h2>
          <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
            <p>1. <strong>Asigna tu Vault:</strong> En Ajustes, indica la carpeta local donde guardas tus notas de Obsidian.</p>
            <p>2. <strong>Configura tus Claves:</strong> Introduce tu clave de Anthropic, OpenAI o Google Gemini (BYOK).</p>
            <p>3. <strong>Explora tus Ideas:</strong> Visualiza tus notas organizadas por clusters de colores y relaciones.</p>
            <p>4. <strong>Consulta a la IA:</strong> Pregunta en el chat para interactuar con tus notas mediante MCP.</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-green" />
            Arquitectura y Privacidad
          </h2>
          <div className="p-4 rounded-lg bg-surface-light border border-border space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Privacidad:</span>
              <span className="text-accent-green font-medium">100% Local (Tus notas nunca salen de tu PC)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Protocolo MCP:</span>
              <span className="text-gray-200 font-mono">stdio JSON-RPC (2024-11-05)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Modelos Soportados:</span>
              <span className="text-accent-purple font-medium">Gemini 3.1 Pro, Claude 3.7, GPT-4.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
