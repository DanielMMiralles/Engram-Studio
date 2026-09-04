# 🧠 Engram Studio

**Engram Studio** es la aplicación de escritorio moderna para visualizar, consultar y orquestar tu cerebro de conocimiento en **Obsidian** y tus proyectos de desarrollo con **Model Context Protocol (MCP)** e inteligencia artificial avanzada.

---

## ✨ Características Principales

1. **Grafo Neuronal Interactivo (Brain Graph)**:
   - Visualización de hardware acelerada en Canvas/WebGL.
   - Representación de notas técnicas como neuronas y wikilinks como sinapsis.
   - Animación de señales sinápticas y filtrado por clusters (#patrones, #backend, #infra, #proyectos).
   - Panel lateral de previsualización de notas Markdown y apertura en Obsidian con un clic.

2. **Chat Inteligente con Herramientas MCP**:
   - Conexión directa a Claude 3.7 Sonnet, OpenAI GPT-4o y Google Gemini 2.0 Flash.
   - Ejecución transparente de herramientas de DevBrain (`search_knowledge`, `get_project_context`, `propose_spec`, etc.).

3. **Explorador de Conocimiento**:
   - Búsqueda y filtrado instantáneo de tus 1,617 notas técnicas curadas.

4. **Radar de Proyectos Insignia**:
   - Monitoreo de repositorios locales (Narval-SGN, AliaLog, Chambita, Mayan-EDMS).
   - Generación de context-bundles para ahorro de hasta un 80% de tokens.

5. **Memoria Persistente (Engram)**:
   - Historial de decisiones arquitectónicas y post-mortems registrados.

---

## 🚀 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo con Hot Module Replacement (HMR)
npm run dev

# 3. Empaquetar instalador de escritorio (.exe)
npm run build
```

---

## 📄 Licencia

MIT License — Código abierto para la comunidad.
