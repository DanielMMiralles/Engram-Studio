import React, { createContext, useContext, useState, useEffect } from 'react';
import { GraphData, GraphNode, NoteItem } from '../types';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
  graphData: GraphData;
  isLoadingGraph: boolean;
  vaultPath: string;
  setVaultPath: (path: string) => void;
  selectedProvider: 'claude' | 'openai' | 'gemini';
  setSelectedProvider: (provider: 'claude' | 'openai' | 'gemini') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedNoteContent: string;
  setSelectedNoteContent: (content: string) => void;
  loadVaultData: () => Promise<void>;
  lang: 'es' | 'en';
  setLang: (l: 'es' | 'en') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('graph');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedNoteContent, setSelectedNoteContent] = useState('');
  const [vaultPath, setVaultPath] = useState('C:\\Users\\damm1\\OneDrive\\Documentos\\Obsidian Vault');
  const [selectedProvider, setSelectedProvider] = useState<'claude' | 'openai' | 'gemini'>('claude');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  const loadVaultData = async () => {
    setIsLoadingGraph(true);
    try {
      if ((window as any).devbrainApi) {
        const data = await (window as any).devbrainApi.scanVault(vaultPath);
        if (data && data.nodes && data.nodes.length > 0) {
          setGraphData(data);
          setIsLoadingGraph(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Electron API unavailable, loading default neural nodes:', e);
    }

    // High quality sample neural graph fallback (represents real vault categories)
    const sampleNodes: GraphNode[] = [
      { id: 'Narval-SGN', label: 'Narval - SGN', category: 'proyectos', val: 10, color: '#f0883e' },
      { id: 'AliaLog-System', label: 'AliaLog System', category: 'proyectos', val: 9, color: '#f0883e' },
      { id: 'Chambita-Ecosystem', label: 'Chambita Ecosystem', category: 'proyectos', val: 9, color: '#f0883e' },
      { id: 'Mayan-EDMS', label: 'Mayan EDMS', category: 'proyectos', val: 7, color: '#f0883e' },
      { id: 'Django', label: 'Django 6.0', category: 'backend', val: 7, color: '#2ea043' },
      { id: 'DRF', label: 'Django REST Framework', category: 'backend', val: 6, color: '#2ea043' },
      { id: 'PostgreSQL', label: 'PostgreSQL Database', category: 'backend', val: 8, color: '#a371f7' },
      { id: 'Docker', label: 'Docker Compose', category: 'infra', val: 8, color: '#39c5bb' },
      { id: 'CQRS', label: 'CQRS Pattern', category: 'patrones', val: 6, color: '#58a6ff' },
      { id: 'Event Sourcing', label: 'Event Sourcing', category: 'patrones', val: 6, color: '#58a6ff' },
      { id: 'NestJS', label: 'NestJS Clean Arch', category: 'backend', val: 7, color: '#2ea043' },
      { id: 'Clean Architecture', label: 'Clean Architecture', category: 'patrones', val: 8, color: '#58a6ff' },
      { id: 'Domain Driven Design', label: 'Domain-Driven Design (DDD)', category: 'patrones', val: 9, color: '#58a6ff' },
      { id: 'Engram Memory', label: 'Engram Memory Engine', category: 'aprendizajes', val: 6, color: '#a371f7' },
      { id: 'OpenSpec SDD', label: 'OpenSpec (SDD Standard)', category: 'patrones', val: 7, color: '#58a6ff' },
      { id: 'React Native', label: 'React Native & Expo', category: 'backend', val: 6, color: '#2ea043' },
      { id: 'LangGraph', label: 'LangGraph Multi-Agent', category: 'backend', val: 7, color: '#2ea043' },
      { id: 'Context7', label: 'Context7 Live Docs', category: 'infra', val: 5, color: '#39c5bb' },
      { id: 'BM25 RAG', label: 'BM25 Retrieval Engine', category: 'patrones', val: 5, color: '#58a6ff' },
    ];

    const sampleLinks = [
      { source: 'Narval-SGN', target: 'Django' },
      { source: 'Narval-SGN', target: 'DRF' },
      { source: 'Narval-SGN', target: 'PostgreSQL' },
      { source: 'Narval-SGN', target: 'Docker' },
      { source: 'AliaLog-System', target: 'NestJS' },
      { source: 'AliaLog-System', target: 'Clean Architecture' },
      { source: 'AliaLog-System', target: 'PostgreSQL' },
      { source: 'Chambita-Ecosystem', target: 'NestJS' },
      { source: 'Chambita-Ecosystem', target: 'React Native' },
      { source: 'Chambita-Ecosystem', target: 'PostgreSQL' },
      { source: 'Clean Architecture', target: 'Domain Driven Design' },
      { source: 'Domain Driven Design', target: 'CQRS' },
      { source: 'CQRS', target: 'Event Sourcing' },
      { source: 'OpenSpec SDD', target: 'Clean Architecture' },
      { source: 'Engram Memory', target: 'BM25 RAG' },
      { source: 'LangGraph', target: 'Context7' },
    ];

    setGraphData({ nodes: sampleNodes, links: sampleLinks });
    setIsLoadingGraph(false);
  };

  useEffect(() => {
    loadVaultData();
  }, []);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      selectedNode, setSelectedNode,
      graphData, isLoadingGraph,
      vaultPath, setVaultPath,
      selectedProvider, setSelectedProvider,
      searchQuery, setSearchQuery,
      selectedNoteContent, setSelectedNoteContent,
      loadVaultData,
      lang, setLang
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
