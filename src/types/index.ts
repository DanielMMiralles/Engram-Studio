export interface GraphNode {
  id: string;
  label: string;
  category: 'patrones' | 'backend' | 'proyectos' | 'aprendizajes' | 'infra' | 'general';
  val: number; // size/weight based on backlinks
  color?: string;
  path?: string;
  tags?: string[];
  summary?: string;
  connections?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  color?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface NoteItem {
  id: string;
  title: string;
  category: string;
  path: string;
  tags: string[];
  content?: string;
  updatedAt?: string;
  size?: number;
}

export interface ProjectItem {
  name: string;
  path: string;
  stack: string[];
  status: string;
  description: string;
  hasDocker?: boolean;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolInvocations?: {
    toolName: string;
    args: any;
    result?: string;
    status: 'running' | 'done' | 'error';
  }[];
}
