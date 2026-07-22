export type NodeType = 'project' | 'category' | 'skill'

export interface Node {
  id: string
  type: NodeType
  label: string
  description: string
  color: string
  size: number
  position: [number, number, number]
  links?: { live?: string; source?: string }
  tags?: string[]
}

export interface Edge {
  source: string
  target: string
}

export const COLORS = {
  background: '#030712',
  project: '#38bdf8',
  category: '#a78bfa',
  skill: '#94a3b8',
  edge: 'rgba(148,163,184,0.1)',
  text: '#f1f5f9',
  accent: '#38bdf8',
} as const

// Deterministic PRNG (mulberry32) so the layout is identical on every load
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(72)
const jitter = (amount: number) => (rand() * 2 - 1) * amount

// Dim a hex color toward black — used for skill nodes inheriting their
// parent category's color
function dim(hex: string, factor = 0.62): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 0xff) * factor)
  const g = Math.round(((n >> 8) & 0xff) * factor)
  const b = Math.round((n & 0xff) * factor)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// ---------------------------------------------------------------------------
// Tier 1 — projects on a sphere of radius 8, spread vertically
// ---------------------------------------------------------------------------

// Layout radii — keep everything outside a radius-3 dead zone at the origin,
// where the hero text overlay lives
const PROJECT_RADIUS = 10

interface ProjectDef {
  id: string
  label: string
  description: string
  links?: { live?: string; source?: string }
  tags: string[]
}

const projectDefs: ProjectDef[] = [
  {
    id: 'legal-agent',
    label: 'Legal Agent',
    description:
      'End-to-end conversational RAG agent specialized in Indian law. Full data pipeline — web scraping, preprocessing, semantic chunking — with persistent ChromaDB storage and Gemini embeddings. Deployed via Streamlit + Nginx on DigitalOcean.',
    links: {
      live: 'https://lagent.adityathakare.app',
      source: 'https://github.com/AdityaThakare72/Legal_Agent1',
    },
    tags: ['RAG', 'LangChain', 'ChromaDB', 'Gemini API', 'Streamlit', 'Nginx'],
  },
  {
    id: 'research-agent',
    label: 'Research Agent',
    description:
      'Self-refining multi-agent research system built with LangGraph — Researcher (Tavily + Gemini), Writer, and Critic agents with iterative revision loops. TypedDict state schema and conditional edges for quality-gated output.',
    links: {
      live: 'https://research-agent.adityathakare.app',
      source: 'https://github.com/AdityaThakare72/Research-Agent',
    },
    tags: ['Agentic AI', 'LangGraph', 'LangChain', 'Gemini API', 'Tavily', 'Docker'],
  },
  {
    id: 'equipment-maintenance',
    label: 'Equipment Maintenance',
    description:
      'Sensor-driven predictive maintenance classifier using XGBoost. Fully decoupled microservices: FastAPI inference, Streamlit visualization, MLflow experiment tracking, and DVC data lineage.',
    links: {
      live: 'https://equipment-maintenance.adityathakare.app',
      source: 'https://github.com/AdityaThakare72/Industrial_Equipment_Maintenance',
    },
    tags: ['XGBoost', 'FastAPI', 'MLflow', 'DVC', 'Docker', 'Nginx'],
  },
  {
    id: 'ceo-dashboard',
    label: 'CEO Dashboard',
    description:
      'Production-grade financial analytics dashboard with natural-language query capabilities for C-suite executives. Agentic backend using LangGraph orchestration with FastAPI, DuckDB/Parquet, and MongoDB.',
    // client project — no public links
    tags: ['LangGraph', 'FastAPI', 'DuckDB', 'Parquet', 'MongoDB', 'Pydantic'],
  },
]

const projectNodes: Node[] = projectDefs.map((p, i) => {
  const theta = i * ((2 * Math.PI) / projectDefs.length)
  return {
    ...p,
    type: 'project',
    color: COLORS.project,
    size: 0.8,
    position: [
      PROJECT_RADIUS * Math.cos(theta),
      (i - 1.5) * 2,
      PROJECT_RADIUS * Math.sin(theta),
    ],
  }
})

// ---------------------------------------------------------------------------
// Tier 2 — categories on a fibonacci sphere of radius 5
// ---------------------------------------------------------------------------

const CATEGORY_RADIUS = 6.5

interface CategoryDef {
  id: string
  label: string
  color: string
  skills: { id: string; label: string }[]
}

const categoryDefs: CategoryDef[] = [
  {
    id: 'cat-languages',
    label: 'Languages',
    color: '#38bdf8',
    skills: [
      { id: 'python', label: 'Python' },
      { id: 'sql', label: 'SQL' },
    ],
  },
  {
    id: 'cat-genai',
    label: 'Generative AI',
    color: '#a78bfa',
    skills: [
      { id: 'rag', label: 'RAG' },
      { id: 'agentic-ai', label: 'Agentic AI' },
      { id: 'llm', label: 'LLM' },
      { id: 'langgraph', label: 'LangGraph' },
      { id: 'langchain', label: 'LangChain' },
      { id: 'gemini-api', label: 'Gemini API' },
      { id: 'openai-api', label: 'OpenAI API' },
      { id: 'prompt-eng', label: 'Prompt Engineering' },
      { id: 'vector-db', label: 'Vector Databases' },
    ],
  },
  {
    id: 'cat-vectorstores',
    label: 'Vector Stores',
    color: '#818cf8',
    skills: [
      { id: 'chromadb', label: 'ChromaDB' },
      { id: 'pinecone', label: 'Pinecone' },
      { id: 'huggingface', label: 'HuggingFace' },
      { id: 'gemini-embed', label: 'Gemini Embeddings' },
      { id: 'semantic-chunk', label: 'Semantic Chunking' },
    ],
  },
  {
    id: 'cat-mldl',
    label: 'ML / Deep Learning',
    color: '#fbbf24',
    skills: [
      { id: 'sklearn', label: 'Scikit-learn' },
      { id: 'xgboost', label: 'XGBoost' },
      { id: 'pytorch', label: 'PyTorch' },
      { id: 'tensorflow', label: 'TensorFlow' },
      { id: 'keras', label: 'Keras' },
      { id: 'cnn', label: 'CNN' },
      { id: 'nlp', label: 'NLP' },
      { id: 'transfer-learning', label: 'Transfer Learning' },
    ],
  },
  {
    id: 'cat-backend',
    label: 'Backend & APIs',
    color: '#34d399',
    skills: [
      { id: 'fastapi', label: 'FastAPI' },
      { id: 'rest-apis', label: 'REST APIs' },
      { id: 'streamlit', label: 'Streamlit' },
      { id: 'pydantic', label: 'Pydantic' },
    ],
  },
  {
    id: 'cat-mlops',
    label: 'MLOps & DevOps',
    color: '#fb923c',
    skills: [
      { id: 'docker', label: 'Docker' },
      { id: 'nginx', label: 'Nginx' },
      { id: 'github-actions', label: 'GitHub Actions' },
      { id: 'cicd', label: 'CI/CD' },
      { id: 'mlflow', label: 'MLflow' },
      { id: 'dvc', label: 'DVC' },
      { id: 'systemd', label: 'SystemD' },
      { id: 'ssl-https', label: 'SSL/HTTPS' },
    ],
  },
  {
    id: 'cat-dataviz',
    label: 'Data & Viz',
    color: '#f472b6',
    skills: [
      { id: 'pandas', label: 'Pandas' },
      { id: 'numpy', label: 'NumPy' },
      { id: 'matplotlib', label: 'Matplotlib' },
      { id: 'seaborn', label: 'Seaborn' },
      { id: 'powerbi', label: 'Power BI' },
      { id: 'tableau', label: 'Tableau' },
    ],
  },
]

const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5))

const categoryNodes: Node[] = categoryDefs.map((c, i) => {
  // i/(n-1) spreads cos(phi) across the full [-1, 1] range, pole to pole
  const phi = Math.acos(1 - (2 * i) / (categoryDefs.length - 1))
  const theta = GOLDEN_ANGLE * i
  return {
    id: c.id,
    type: 'category',
    label: c.label,
    description: '',
    color: c.color,
    size: 0.9,
    position: [
      CATEGORY_RADIUS * Math.sin(phi) * Math.cos(theta),
      CATEGORY_RADIUS * Math.cos(phi),
      CATEGORY_RADIUS * Math.sin(phi) * Math.sin(theta),
    ],
  }
})

// ---------------------------------------------------------------------------
// Tier 3 — skills clustered around their parent category
// ---------------------------------------------------------------------------

const skillNodes: Node[] = categoryDefs.flatMap((c, ci) => {
  const [cx, cy, cz] = categoryNodes[ci].position
  return c.skills.map((s, si): Node => {
    const angle = si * ((2 * Math.PI) / c.skills.length)
    return {
      id: s.id,
      type: 'skill',
      label: s.label,
      description: '',
      color: dim(c.color),
      size: 0.4,
      position: [
        cx + 1.8 * Math.cos(angle) + jitter(0.3),
        cy + jitter(0.8),
        cz + 1.8 * Math.sin(angle) + jitter(0.3),
      ],
    }
  })
})

export const nodes: Node[] = [...projectNodes, ...categoryNodes, ...skillNodes]

export const nodeById = new Map(nodes.map((n) => [n.id, n]))

// ---------------------------------------------------------------------------
// Edges
// ---------------------------------------------------------------------------

const categorySkillEdges: Edge[] = categoryDefs.flatMap((c) =>
  c.skills.map((s) => ({ source: c.id, target: s.id })),
)

const projectSkillEdges: Edge[] = [
  ['legal-agent', ['rag', 'langchain', 'chromadb', 'gemini-api', 'streamlit', 'nginx']],
  ['research-agent', ['agentic-ai', 'langgraph', 'langchain', 'gemini-api', 'docker']],
  ['equipment-maintenance', ['xgboost', 'fastapi', 'mlflow', 'dvc', 'docker', 'nginx', 'streamlit']],
  ['ceo-dashboard', ['langgraph', 'fastapi', 'pydantic']],
].flatMap(([source, targets]) =>
  (targets as string[]).map((target) => ({ source: source as string, target })),
)

const projectCategoryEdges: Edge[] = [
  ['legal-agent', ['cat-genai', 'cat-vectorstores', 'cat-backend']],
  ['research-agent', ['cat-genai', 'cat-backend', 'cat-mlops']],
  ['equipment-maintenance', ['cat-mldl', 'cat-backend', 'cat-mlops']],
  ['ceo-dashboard', ['cat-genai', 'cat-backend']],
].flatMap(([source, targets]) =>
  (targets as string[]).map((target) => ({ source: source as string, target })),
)

export const edges: Edge[] = [
  ...categorySkillEdges,
  ...projectSkillEdges,
  ...projectCategoryEdges,
]
