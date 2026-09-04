import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Statusbar } from './components/Statusbar';
import { NotePreview } from './components/NotePreview';
import { useApp } from './context/AppContext';
import { Dashboard } from './views/Dashboard';
import { BrainGraph } from './views/BrainGraph';
import { Chat } from './views/Chat';
import { KnowledgeBase } from './views/KnowledgeBase';
import { ProjectsView } from './views/ProjectsView';
import { MemoryView } from './views/MemoryView';
import { SettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-gray-200">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 flex overflow-hidden relative">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'graph' && <BrainGraph />}
            {activeTab === 'chat' && <Chat />}
            {activeTab === 'knowledge' && <KnowledgeBase />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'memory' && <MemoryView />}
            {activeTab === 'settings' && <SettingsView />}
            <NotePreview />
          </main>
        </div>
      </div>
      <Statusbar />
    </div>
  );
};
