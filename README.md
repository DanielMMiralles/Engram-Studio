# 🧠 Engram Studio

[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/electron-34-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-18-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)](https://www.typescriptlang.org/)

**Engram Studio** es una aplicación de escritorio moderna de código abierto para visualizar, consultar y gestionar tu propio cerebro de conocimiento en **Obsidian** y tus proyectos de desarrollo mediante **Model Context Protocol (MCP)** y los modelos de inteligencia artificial más avanzados (Gemini 3.8 Flash, Claude Fable 5.1 / Opus 5, GPT-5.6 Sol / Terra y DeepSeek-V4).

---

## 🔒 Privacidad por Diseño (Zero-Leak Policy)

Engram Studio es una herramienta 100% de cliente local:
- **Tus notas nunca salen de tu ordenador**: Se leen directamente desde tu sistema de archivos.
- **Sin servidores intermedios**: La aplicación se conecta directamente desde tu máquina a las APIs oficiales de los proveedores (BYOK - Bring Your Own Key).
- **Almacenamiento Aislado**: Cada usuario configura y administra su propio almacén de Obsidian y sus propios proyectos de forma independiente.

---

## ✨ Características Principales

1. **Grafo Neuronal Interactivo (Brain Graph)**:
   - Visualización de hardware acelerada en Canvas/WebGL.
   - Representación de notas técnicas como neuronas y wikilinks como sinapsis.
   - Señales sinápticas animadas y filtrado por clusters (#patrones, #backend, #infra, #proyectos).
   - Panel lateral de previsualización de notas Markdown y apertura en Obsidian con un solo clic.

2. **Chat Inteligente con Soporte de Modelos Frontier (2026)**:
   - **Google Gemini**:
     - `gemini-3.8-flash`: Modelo insignia agéntico para codificación y flujos multi-paso.
     - `gemini-3.8-flash-cyber`: Especializado en ciberseguridad, vulnerabilidades y hardening.
     - `gemini-3.7-flash` & `gemini-3.6-flash`: Alta velocidad e ingeniería de software.
     - `gemini-3.5-pro` & `gemini-3.5-flash`: Razonamiento profundo y base eficiente.
     - `gemini-3.1-pro-preview`: Razonamiento experimental avanzado.
   - **Anthropic (Claude Series)**:
     - `claude-fable-5-1`: Flagship de la clase *Mythos* con 1M de tokens de contexto y razonamiento autónomo.
     - `claude-opus-5`: Modelo diario de máxima potencia para arquitectura y desarrollo complejo.
     - `claude-sonnet-5`: Modelo balanceado de alta velocidad para entornos de producción.
     - `claude-opus-4-8` & `claude-opus-4-6`: Especialistas en razonamiento pesado.
     - `claude-haiku-4-5`: Modelo ultrarrápido de baja latencia.
   - **OpenAI (GPT-5.6 & GPT-6 Tiers)**:
     - `gpt-5.6-sol`: Modelo insignia para arquitectura crítica, matemáticas y programación avanzada.
     - `gpt-5.6-terra`: Modelo balanceado todoterreno para trabajo profesional diario.
     - `gpt-5.6-luna`: Modelo ultra-rápido y costo-eficiente para tareas masivas.
     - `gpt-6-astra`: Vista previa de la próxima generación de inteligencia frontier.
     - `o3-mini`: Razonamiento analítico profundo.
   - **Modelos Chinos (Arquitectura MoE Trillones de Parámetros)**:
     - `deepseek-v4-pro`: 1.6 billones de parámetros (MoE), el referente global en código y costo-eficiencia.
     - `deepseek-r1`: Razonamiento puro por cadena de pensamiento (*Chain of Thought*).
     - `qwen-3.8-max`: 2.4 billones de parámetros, líder en comprensión técnica multilingüe.
     - `kimi-k3`: 2.8 billones de parámetros, alta capacidad multimodal y agentes complejos.
     - `glm-5.3`: Especialista en agentes y llamadas a herramientas (*Tool-Use*) con 1M de contexto.
   - **Bucle Autónomo de Herramientas MCP**: Todos los modelos consultan automáticamente tu Vault local mediante las herramientas de DevBrain sin intermediarios.

3. **Gestión de Proyectos & Memoria Persistente (Engram)**:
   - Registro de decisiones de arquitectura y aprendizajes entre sesiones de IA.
   - Estandarización de especificaciones con OpenSpec (SDD).

---

## 🚀 Inicio Rápido (Desarrollo Local)

```bash
# 1. Clonar el repositorio
git clone https://github.com/DanielMMiralles/Engram-Studio.git
cd Engram-Studio

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev

# 4. Compilar para produccion
npm run build
```

---

## 📄 Licencia

MIT License — Código abierto para la comunidad.
