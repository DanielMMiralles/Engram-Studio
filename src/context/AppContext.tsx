import React, { createContext, useContext, useState, useEffect } from 'react';
import { GraphData, GraphNode } from '../types';

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
  const [vaultPath, setVaultPath] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'claude' | 'openai' | 'gemini'>('claude');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  const loadVaultData = async () => {
    setIsLoadingGraph(true);
    try {
      if ((window as any).devbrainApi) {
        const settings = await (window as any).devbrainApi.getSettings();
        const currentPath = settings?.vaultPath || vaultPath;
        if (currentPath) {
          setVaultPath(currentPath);
          const data = await (window as any).devbrainApi.scanVault(currentPath);
          if (data && data.nodes && data.nodes.length > 0) {
            setGraphData(data);
            setIsLoadingGraph(false);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Electron API scanner error:', e);
    }

    // Generic educational architecture sample nodes (zero personal references)
    const genericNodes: GraphNode[] = [
      { id: 'Clean Architecture', label: 'Clean Architecture', category: 'patrones', val: 9, color: '#58a6ff' },
      { id: 'Domain Driven Design', label: 'Domain-Driven Design (DDD)', category: 'patrones', val: 9, color: '#58a6ff' },
      { id: 'CQRS', label: 'CQRS Pattern', category: 'patrones', val: 7, color: '#58a6ff' },
      { id: 'Event Sourcing', label: 'Event Sourcing', category: 'patrones', val: 7, color: '#58a6ff' },
      { id: 'Microservicios', label: 'Arquitectura de Microservicios', category: 'patrones', val: 8, color: '#58a6ff' },
      { id: 'REST & GraphQL', label: 'APIs RESTful y GraphQL', category: 'backend', val: 7, color: '#2ea043' },
      { id: 'PostgreSQL & SQL', label: 'Modelado Relacional (SQL)', category: 'backend', val: 8, color: '#a371f7' },
      { id: 'Docker & Containers', label: 'Contenedores y Docker Compose', category: 'infra', val: 8, color: '#39c5bb' },
      { id: 'CI/CD Pipelines', label: 'Pipelines Automatizados CI/CD', category: 'infra', val: 6, color: '#39c5bb' },
      { id: 'TDD & BDD', label: 'Desarrollo Guiado por Pruebas', category: 'patrones', val: 7, color: '#58a6ff' },
      { id: 'OpenSpec SDD', label: 'Spec-Driven Development', category: 'patrones', val: 8, color: '#58a6ff' },
      { id: 'Engram Memory', label: 'Sistema de Memoria Persistente', category: 'aprendizajes', val: 7, color: '#a371f7' },
    ];

    const genericLinks = [
      { source: 'Clean Architecture', target: 'Domain Driven Design' },
      { source: 'Domain Driven Design', target: 'CQRS' },
      { source: 'CQRS', target: 'Event Sourcing' },
      { source: 'Clean Architecture', target: 'TDD & BDD' },
      { source: 'OpenSpec SDD', target: 'Clean Architecture' },
      { source: 'Microservicios', target: 'Docker & Containers' },
      { source: 'Microservicios', target: 'REST & GraphQL' },
      { source: 'REST & GraphQL', target: 'PostgreSQL & SQL' },
      { source: 'Docker & Containers', target: 'CI/CD Pipelines' },
      { source: 'Engram Memory', target: 'Clean Architecture' },
    ];

    setGraphData({ nodes: genericNodes, links: genericLinks });
    setIsLoadingGraph(false);
  };

  useEffect(() => {
    loadVaultData();
  }, []);

  useEffect(() => {
    if (selectedNode && selectedNode.path && (window as any).devbrainApi) {
      (window as any).devbrainApi.readNote(selectedNode.path).then((content: string) => {
        setSelectedNoteContent(content || '');
      }).catch(() => {
        setSelectedNoteContent('');
      });
    } else {
      setSelectedNoteContent('');
    }
  }, [selectedNode]);

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
