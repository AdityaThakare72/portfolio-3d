# CLAUDE.md — 3D Neural Network Portfolio

## Project Overview
An interactive 3D portfolio for Aditya Thakare (AI Engineer & Data Scientist). The entire portfolio is visualized as a **neural network graph** — projects are large glowing nodes, skill categories are medium nodes, individual skills are small nodes, all connected by edges. Visitors explore by clicking nodes, which triggers camera fly-to animations and detail panels.

## Tech Stack
- **Bundler:** Vite
- **Framework:** React 18 + TypeScript
- **3D Engine:** React Three Fiber (@react-three/fiber) + drei (@react-three/drei)
- **3D Types:** three (Three.js)
- **Animations:** Framer Motion (for 2D UI overlays/panels)
- **Styling:** Tailwind CSS (for 2D overlay UI only — navbar, panels, text)
- **Deployment target:** Vercel (static site)

## Architecture

### Two layers
1. **3D Canvas** (React Three Fiber) — the neural network graph, background particles, lighting, camera controls
2. **2D Overlay** (React + Tailwind) — navbar, detail panels, about section, contact links. Positioned absolutely over the canvas.

### Data model (`src/data/portfolio.ts`)
All portfolio content lives in ONE file as typed arrays:
- `nodes: Node[]` — each has id, type ("project" | "category" | "skill"), label, description, color, size, position, links, tags
- `edges: Edge[]` — each has source and target node IDs
- Positions are pre-computed (spherical layout), NOT physics-simulated

### Key components
```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Canvas + overlay composition
├── data/
│   └── portfolio.ts            # All nodes, edges, colors, descriptions
├── components/
│   ├── canvas/                 # 3D components (rendered inside <Canvas>)
│   │   ├── NetworkGraph.tsx    # Main graph — renders all nodes + edges
│   │   ├── NodeMesh.tsx        # Single node sphere with glow + hover
│   │   ├── EdgeLine.tsx        # Connection line between nodes
│   │   ├── Background.tsx      # Particles / starfield
│   │   └── CameraController.tsx # Orbit controls + fly-to animation
│   └── ui/                     # 2D overlay components (regular React)
│       ├── Navbar.tsx
│       ├── DetailPanel.tsx     # Slide-in panel for selected node
│       ├── HeroOverlay.tsx     # Name + title centered over graph
│       └── ContactOverlay.tsx
├── hooks/
│   └── useGraphStore.ts        # Zustand store for selected node, camera target
└── styles/
    └── index.css               # Tailwind + custom styles
```

## Design System
- **Background:** #030712 (gray-950) — deep dark, almost black
- **Node colors:**
  - Projects: #38bdf8 (sky-400) — large, glowing
  - Categories: #a78bfa (violet-400) — medium
  - Skills: #94a3b8 (slate-400) — small, subtle
- **Edges:** rgba(148,163,184,0.1) — very faint, visible on hover
- **Text overlay:** white (#f1f5f9) on transparent/glass panels
- **Font:** Plus Jakarta Sans (same as the main portfolio for brand consistency)
- **Accent:** #38bdf8 (sky-400)

## Interaction Model
1. **Idle:** graph auto-rotates slowly via OrbitControls autoRotate
2. **Hover node:** node brightens (emissive intensity up), label fades in, connected edges glow
3. **Click node:** camera animates to focus on the node, DetailPanel slides in from right
4. **Click away / press Escape / click back:** camera returns to overview, panel slides out
5. **Nav links:** clicking "Projects" flies camera to the project cluster, "Skills" to skill cluster, etc.
6. **Auto-rotate resumes** after 3 seconds of no interaction

## Key Conventions
- 3D components go in `components/canvas/` — these render INSIDE `<Canvas>`
- 2D UI components go in `components/ui/` — these render OUTSIDE `<Canvas>`
- Never mix — a canvas component cannot use DOM elements, a UI component cannot use Three.js
- Use drei helpers whenever possible (Text, Billboard, OrbitControls, Stars, etc.)
- State management via Zustand (useGraphStore) — tracks selectedNode, hoveredNode, cameraTarget
- Framer Motion for 2D panel enter/exit animations (AnimatePresence)
- All data comes from `data/portfolio.ts` — no API calls, no external data

## Content Source
Aditya's portfolio data (for populating `portfolio.ts`):

### Projects (4)
1. **Conversational Legal Agent** — RAG agent for Indian law, ChromaDB, Gemini embeddings, Streamlit + Nginx on DigitalOcean. [Live](https://lagent.adityathakare.app) | [Source](https://github.com/AdityaThakare72/Legal_Agent1)
2. **Agentic Research System** — Multi-agent LangGraph system (Researcher, Writer, Critic), Tavily + Gemini, Docker. [Live](https://research-agent.adityathakare.app) | [Source](https://github.com/AdityaThakare72/Research-Agent)
3. **Industrial Equipment Maintenance** — XGBoost predictive maintenance, FastAPI + MLflow + DVC, microservices. [Live](https://equipment-maintenance.adityathakare.app) | [Source](https://github.com/AdityaThakare72/Industrial_Equipment_Maintenance)
4. **CEO Financial Dashboard** — LangGraph + FastAPI, DuckDB/Parquet, MongoDB, GPT-4o-mini. Client project (no public links).

### Skill Categories (7)
1. Languages: Python, SQL
2. Generative AI: RAG, Agentic AI, LLM, LangGraph, LangChain, Gemini API, OpenAI API, Prompt Engineering, Vector Databases
3. Vector Stores: ChromaDB, Pinecone, HuggingFace, Gemini Embeddings, Semantic Chunking
4. ML / Deep Learning: Scikit-learn, XGBoost, PyTorch, TensorFlow, Keras, CNN, NLP, Transfer Learning
5. Backend & APIs: FastAPI, REST APIs, Streamlit, Pydantic
6. MLOps & DevOps: Docker, Nginx, GitHub Actions, CI/CD, MLflow, DVC, SystemD, SSL/HTTPS
7. Data & Viz: Pandas, NumPy, Matplotlib, Seaborn, Power BI, Tableau

### About
Data Scientist with 2+ years of experience designing and deploying production-grade Generative AI systems — RAG pipelines, multi-agent LangGraph orchestration, and end-to-end MLOps workflows. Delivered technical training to 2,000+ professionals across 10+ industry engagements.

### Links
- GitHub: https://github.com/AdityaThakare72
- LinkedIn: https://www.linkedin.com/in/aditya-thakare72/
- Email: adityathakare72@gmail.com
- Location: Pune, Maharashtra

## Commands
```bash
cd /home/aditya/portfolio-3d
npm run dev          # Dev server (typically http://localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

## Performance Notes
- Target 60fps on mid-range hardware
- Keep total node count under 50 (currently ~41)
- Use InstancedMesh if performance drops with individual meshes
- Disable post-processing on mobile
- Consider a 2D fallback for low-power devices