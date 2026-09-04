import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Wrench, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const Chat: React.FC = () => {
  const { selectedProvider, lang } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente en Engram Studio. Estoy listo para ayudarte a explorar tus notas de conocimiento, consultar arquitectura de software y ejecutar herramientas MCP sobre tu propio almacén. ¿Qué deseas consultar hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [savedSettings, setSavedSettings] = useState<any>({});

  useEffect(() => {
    if ((window as any).devbrainApi) {
      (window as any).devbrainApi.getSettings().then((s: any) => {
        if (s) setSavedSettings(s);
      });
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Parse composite provider string (e.g. "claude:claude-fable-5-1" or "openai:gpt-5.6-sol")
    let providerName = selectedProvider;
    let modelName = '';
    if (selectedProvider.includes(':')) {
      const parts = selectedProvider.split(':');
      providerName = parts[0] as any;
      modelName = parts[1];
    }

    let apiKey = '';
    if (providerName === 'claude') apiKey = savedSettings.anthropicKey;
    else if (providerName === 'openai') apiKey = savedSettings.openaiKey;
    else if (providerName === 'gemini') apiKey = savedSettings.geminiKey;
    else if (providerName === 'deepseek') apiKey = savedSettings.deepseekKey;
    else if (providerName === 'qwen') apiKey = savedSettings.qwenKey;
    else if (providerName === 'kimi') apiKey = savedSettings.kimiKey;
    else if (providerName === 'glm') apiKey = savedSettings.glmKey;

    try {
      if ((window as any).devbrainApi) {
        const res = await (window as any).devbrainApi.chat({
          provider: providerName,
          model: modelName,
          apiKey: apiKey || '',
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        });

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolInvocations: res.toolInvocations
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setTimeout(() => {
          const mockMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `[Simulación]: Consulta procesada con ${providerName} (${modelName || 'default'}).`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, mockMsg]);
        }, 800);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error al conectar con la API (${providerName}): ${err.message}. Verifica tu clave API en Configuración.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>

                {m.toolInvocations && m.toolInvocations.map((tool, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface-light border border-border flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 text-primary-light font-mono">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>mcp: {tool.toolName}</span>
                    </div>
                    <span className="flex items-center gap-1 text-accent-green font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Ejecutado en tu Vault
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
              Ejecutando herramientas y consultando modelo frontier...
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
            placeholder={lang === 'es' ? 'Pregunta sobre tus proyectos o conceptos de arquitectura...' : 'Ask about your projects or architecture concepts...'}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:hover:bg-primary text-white transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
