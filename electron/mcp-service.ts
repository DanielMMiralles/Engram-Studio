import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
}

export class McpService {
  private process: ChildProcess | null = null;
  private messageId = 1;
  private pendingRequests = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private buffer = '';
  private toolsCache: McpToolDefinition[] = [];

  constructor() {}

  public async start(): Promise<boolean> {
    if (this.process) return true;

    // Check sibling repository or environment variable
    const candidates = [
      process.env.DEVBRAIN_MCP_PATH || '',
      path.join(__dirname, '../../devbrain-mcp/src/devbrain_mcp.py'),
      path.join(process.cwd(), '../devbrain-mcp/src/devbrain_mcp.py'),
      path.join(process.cwd(), 'devbrain-mcp/src/devbrain_mcp.py')
    ].filter(Boolean);

    let scriptPath = '';
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        scriptPath = c;
        break;
      }
    }

    if (!scriptPath) {
      console.warn('[MCP] Server script not found in standard relative paths. Ensure devbrain-mcp is available.');
      return false;
    }

    console.log(`[MCP] Spawning MCP server from: ${scriptPath}`);
    this.process = spawn('python', ['-u', scriptPath], {
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1',
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.process.stdout?.on('data', (data: Buffer) => {
      this.buffer += data.toString('utf-8');
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const msg = JSON.parse(trimmed);
          if (msg.id && this.pendingRequests.has(msg.id)) {
            const { resolve, reject } = this.pendingRequests.get(msg.id)!;
            this.pendingRequests.delete(msg.id);
            if (msg.error) {
              reject(new Error(msg.error.message || JSON.stringify(msg.error)));
            } else {
              resolve(msg.result);
            }
          }
        } catch (err) {
          console.warn('[MCP stdio parse error]:', trimmed);
        }
      }
    });

    this.process.stderr?.on('data', (data) => {
      console.warn('[MCP log]:', data.toString('utf-8'));
    });

    this.process.on('close', (code) => {
      console.log(`[MCP] Process exited with code ${code}`);
      this.process = null;
    });

    try {
      await this.sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'EngramStudio', version: '1.0.0' }
      });
      await this.listTools();
      return true;
    } catch (e) {
      console.error('[MCP] Handshake failed:', e);
      return false;
    }
  }

  public async listTools(): Promise<McpToolDefinition[]> {
    if (this.toolsCache.length > 0) return this.toolsCache;
    const res = await this.sendRequest('tools/list', {});
    this.toolsCache = res?.tools || [];
    return this.toolsCache;
  }

  public async callTool(name: string, args: any): Promise<any> {
    const res = await this.sendRequest('tools/call', { name, arguments: args });
    return res;
  }

  private sendRequest(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin) {
        return reject(new Error('MCP server process is not running'));
      }
      const id = this.messageId++;
      this.pendingRequests.set(id, { resolve, reject });
      const req = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
      this.process.stdin.write(req);
    });
  }

  public stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}
