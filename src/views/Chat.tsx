import React, { useState } from 'react';
import { Send, Sparkles, Terminal, Bot, User, Wrench, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const Chat: React.FC = () => {
  const { selectedProvider, lang } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy el asistente de Engram Studio. Tengo acceso completo a tu almacén de conocimiento (1,682 notas), tus proyectos locales y todas las herramientas MCP (OpenSpec, RAG, empaquetador de contexto). ¿En qué te ayudo hoy?',
      timestamp: '12:00 PM'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate MCP Tool invocation response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Consulté la base de conocimiento y el contexto técnico usando las herramientas MCP de DevBrain. Para resolver tu consulta sobre "${userMsg.content}", te recomiendo seguir las directivas de Clean Architecture y la especificación BDD definida en OpenSpec.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolInvocations: [
          {
            toolName: 'search_knowledge',
            args: { query: userMsg.content },
            result: 'Coincidencias encontradas en [[Clean Architecture Core Domain]] y [[CQRS Pattern]]',
            status: 'done'
          }
        ]
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isUser ? 'bg-primary text-white' : 'bg-accent-purple text-white shadow-lg shadow-accent-purple/20'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-2 text-xs ${isUser ? 'items-end' : ''}`}>
                <div className={`p-4 rounded-2xl ${
                  isUser 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-surface border border-border text-gray-200 rounded-tl-none leading-relaxed'
                }`}>
                  {m.content}
                </div>

                {/* MCP Tool Invocation Badge */}
                {m.toolInvocations && m.toolInvocations.map((tool, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface-light border border-border flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 text-primary-light font-mono">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>mcp_tool: {tool.toolName}</span>
                    </div>
                    <span className="flex items-center gap-1 text-accent-green font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Completado
                    </span>
                  </div>
                ))}

                <span className="text-[10px] text-gray-500 block px-1">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-accent-purple text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-border text-xs text-gray-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-accent-purple" />
              Engram está ejecutando herramientas MCP...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-border bg-surface/50">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-surface border border-border rounded-xl p-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'es' ? 'Pregunta sobre tus proyectos, patrones o pide redactar una spec...' : 'Ask about your projects, architecture patterns or generate specs...'}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:hover:bg-primary text-white transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
