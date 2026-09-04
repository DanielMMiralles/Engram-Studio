# 🧠 Engram Studio

[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/electron-34-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-18-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)](https://www.typescriptlang.org/)

**Engram Studio** es una aplicación de escritorio moderna de código abierto para visualizar, consultar y gestionar tu propio cerebro de conocimiento en **Obsidian** y tus proyectos de desarrollo mediante **Model Context Protocol (MCP)** y los modelos de inteligencia artificial más avanzados (Gemini 3.1 Pro, Claude 3.7 Sonnet y GPT-4.5).

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

2. **Chat Inteligente con Soporte de Modelos de Última Generación**:
   - **Google Gemini**: Gemini 3.1 Pro Preview y Gemini 2.5.
   - **Anthropic**: Claude 3.7 Sonnet (con Hybrid Reasoning) y Claude 3.5 Sonnet.
   - **OpenAI**: GPT-4.5 Preview y o3-mini.
   - Bucle autónomo de herramientas MCP: El modelo consulta tus notas y responde fundamentado en tu información.

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
