import { McpService, McpToolDefinition } from './mcp-service';

export interface ChatPayload {
  provider: 'claude' | 'openai' | 'gemini' | 'deepseek' | 'qwen' | 'kimi' | 'glm';
  apiKey: string;
  model?: string;
  baseUrl?: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
}

export interface ChatResponse {
  content: string;
  toolInvocations: {
    toolName: string;
    args: any;
    result: string;
    status: 'done' | 'error';
  }[];
}

export class LlmService {
  constructor(private mcpService: McpService) {}

  public async executeChat(payload: ChatPayload): Promise<ChatResponse> {
    const tools = await this.mcpService.listTools();
    const toolInvocations: ChatResponse['toolInvocations'] = [];

    switch (payload.provider) {
      case 'claude':
        return this.executeClaude(payload, tools, toolInvocations);
      case 'gemini':
        return this.executeGemini(payload, tools, toolInvocations);
      case 'openai':
      case 'deepseek':
      case 'qwen':
      case 'kimi':
      case 'glm':
      default:
        return this.executeOpenAiCompatible(payload, tools, toolInvocations);
    }
  }

  // 1. Anthropic Claude Family (Fable 5.1, Opus 5, Opus 4.8, Opus 4.6, Sonnet 5, Haiku 4.5)
  private async executeClaude(
    payload: ChatPayload, 
    tools: McpToolDefinition[], 
    toolInvocations: ChatResponse['toolInvocations']
  ): Promise<ChatResponse> {
    const apiKey = payload.apiKey;
    if (!apiKey) {
      return {
        content: '⚠️ No se ha configurado la API Key de Anthropic. Por favor ingrésala en Configuración.',
        toolInvocations: []
      };
    }

    const model = payload.model || 'claude-fable-5-1';
    const anthropicTools = tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema || { type: 'object', properties: {} }
    }));

    let currentMessages: any[] = payload.messages.map(m => ({
      role: m.role === 'system' ? 'user' : m.role,
      content: m.content
    }));

    for (let step = 0; step < 5; step++) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: 'Eres el copiloto inteligente de Engram Studio con soporte para modelos frontier. Tienes acceso directo a herramientas MCP para consultar arquitectura, notas técnicas y proyectos locales.',
          messages: currentMessages,
          tools: anthropicTools
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API Error (${res.status}): ${errText}`);
      }

      const data: any = await res.json();
      const toolUseBlocks = data.content?.filter((b: any) => b.type === 'tool_use') || [];
      const textBlocks = data.content?.filter((b: any) => b.type === 'text') || [];

      if (toolUseBlocks.length === 0) {
        const finalText = textBlocks.map((b: any) => b.text).join('\n');
        return { content: finalText, toolInvocations };
      }

      currentMessages.push({ role: 'assistant', content: data.content });
      const toolResultContents: any[] = [];

      for (const toolUse of toolUseBlocks) {
        try {
          const toolRes = await this.mcpService.callTool(toolUse.name, toolUse.input);
          const textResult = toolRes?.content?.[0]?.text || JSON.stringify(toolRes);
          toolInvocations.push({
            toolName: toolUse.name,
            args: toolUse.input,
            result: textResult,
            status: 'done'
          });
          toolResultContents.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: textResult
          });
        } catch (err: any) {
          toolInvocations.push({
            toolName: toolUse.name,
            args: toolUse.input,
            result: err.message,
            status: 'error'
          });
          toolResultContents.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: `Error: ${err.message}`,
            is_error: true
          });
        }
      }

      currentMessages.push({ role: 'user', content: toolResultContents });
    }

    return { content: 'Límite de iteraciones de herramientas alcanzado.', toolInvocations };
  }

  // 2. OpenAI (Sol, Terra, Luna, Astra) & Chinese Frontier (DeepSeek-V4, Qwen3.8, Kimi K3, GLM-5.3)
  private async executeOpenAiCompatible(
    payload: ChatPayload, 
    tools: McpToolDefinition[], 
    toolInvocations: ChatResponse['toolInvocations']
  ): Promise<ChatResponse> {
    const apiKey = payload.apiKey;
    if (!apiKey) {
      return {
        content: `⚠️ No se ha configurado la API Key para el proveedor ${payload.provider.toUpperCase()}. Por favor ingrésala en Configuración.`,
        toolInvocations: []
      };
    }

    // Determine endpoint & default model based on provider
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let defaultModel = 'gpt-5.6-sol';

    if (payload.provider === 'deepseek') {
      endpoint = 'https://api.deepseek.com/v1/chat/completions';
      defaultModel = 'deepseek-v4-pro';
    } else if (payload.provider === 'qwen') {
      endpoint = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
      defaultModel = 'qwen-3.8-max';
    } else if (payload.provider === 'kimi') {
      endpoint = 'https://api.moonshot.cn/v1/chat/completions';
      defaultModel = 'kimi-k3';
    } else if (payload.provider === 'glm') {
      endpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
      defaultModel = 'glm-5.3';
    }

    const model = payload.model || defaultModel;
    const openaiTools = tools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema || { type: 'object', properties: {} }
      }
    }));

    let currentMessages: any[] = [
      {
        role: 'system',
        content: 'Eres el copiloto inteligente de Engram Studio con soporte para modelos frontier. Tienes acceso a herramientas MCP para gestión de proyectos y conocimiento.'
      },
      ...payload.messages
    ];

    for (let step = 0; step < 5; step++) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: currentMessages,
          tools: openaiTools
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${payload.provider.toUpperCase()} API Error (${res.status}): ${errText}`);
      }

      const data: any = await res.json();
      const choice = data.choices?.[0];
      const message = choice?.message;

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return { content: message.content || '', toolInvocations };
      }

      currentMessages.push(message);

      for (const tc of message.tool_calls) {
        const toolName = tc.function.name;
        let toolArgs = {};
        try { toolArgs = JSON.parse(tc.function.arguments); } catch (e) {}

        try {
          const toolRes = await this.mcpService.callTool(toolName, toolArgs);
          const textResult = toolRes?.content?.[0]?.text || JSON.stringify(toolRes);
          toolInvocations.push({
            toolName,
            args: toolArgs,
            result: textResult,
            status: 'done'
          });
          currentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: textResult
          });
        } catch (err: any) {
          toolInvocations.push({
            toolName,
            args: toolArgs,
            result: err.message,
            status: 'error'
          });
          currentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: `Error: ${err.message}`
          });
        }
      }
    }

    return { content: 'Límite de herramientas alcanzado.', toolInvocations };
  }

  // 3. Google Gemini (Gemini 3.1 Pro, Gemini 3 Flash, Gemini 2.5 Pro)
  private async executeGemini(
    payload: ChatPayload, 
    tools: McpToolDefinition[], 
    toolInvocations: ChatResponse['toolInvocations']
  ): Promise<ChatResponse> {
    const apiKey = payload.apiKey;
    if (!apiKey) {
      return {
        content: '⚠️ No se ha configurado la API Key de Google Gemini. Por favor ingrésala en Configuración.',
        toolInvocations: []
      };
    }

    const model = payload.model || 'gemini-3.1-pro-preview';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const lastMessage = payload.messages[payload.messages.length - 1]?.content || '';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: lastMessage }] }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText}`);
    }

    const data: any = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return {
      content: candidate,
      toolInvocations: []
    };
  }
}
