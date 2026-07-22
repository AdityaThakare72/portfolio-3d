export type NodeType = 'project' | 'category' | 'skill' | 'blog' | 'cert' | 'info'

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

// ---------------------------------------------------------------------------
// Outer rings — blogs (r=12), certs (r=12.5, interleaved), info (r=11)
// ---------------------------------------------------------------------------

const BLOG_RADIUS = 12

const blogDefs = [
  {
    id: 'blog-graph-rag',
    label: 'Graph RAG vs Vector RAG',
    description:
      'A detailed comparison between Vector RAG and Graph RAG — why graph-based retrieval wins for context and relationship-driven queries.',
    links: {
      live: 'https://medium.com/@adityathakare72/graph-rag-vs-vector-rag-why-your-ai-needs-a-brain-not-just-a-library-ca0e896c2907',
    },
    tags: ['GraphRAG', 'RAG'],
  },
  {
    id: 'blog-cbow',
    label: 'CBOW in Word2Vec',
    description:
      "An educational look at Word2Vec's CBOW architecture and how it generates vector representations of words based on context.",
    links: {
      live: 'https://medium.com/@adityathakare72/understanding-cbow-in-word2vec-the-power-of-contextualized-word-embeddings-61e7446d061d',
    },
    tags: ['NLP', 'Deep Learning'],
  },
  {
    id: 'blog-rnn',
    label: 'Parameter Sharing in RNN',
    description:
      'An exploration of Recurrent Neural Networks and the architectural reasons for sharing weights across time steps.',
    links: {
      live: 'https://medium.com/@adityathakare72/why-parameter-sharing-in-standard-rnn-03e72679d59b',
    },
    tags: ['RNN', 'Deep Learning'],
  },
  {
    id: 'blog-prompts',
    label: 'Power of Prompts',
    description:
      'A foundational guide explaining prompts, how they guide LLMs, and their importance in making AI accessible.',
    links: {
      live: 'https://medium.com/@adityathakare72/title-understanding-the-power-of-prompts-in-language-models-cf7323fb2ad9',
    },
    tags: ['Prompt Engineering', 'GenAI'],
  },
]

// Offset the blog ring 45° from the project ring so they don't stack
const blogNodes: Node[] = blogDefs.map((b, i) => {
  const theta = Math.PI / 4 + i * ((2 * Math.PI) / blogDefs.length)
  return {
    ...b,
    type: 'blog',
    color: '#f472b6',
    size: 0.6,
    position: [
      BLOG_RADIUS * Math.cos(theta),
      (i - 1.5) * 2.5 + jitter(0.4),
      BLOG_RADIUS * Math.sin(theta),
    ],
  }
})

const CERT_RADIUS = 12.5

const certDefs = [
  {
    id: 'cert-genai-rag',
    label: 'GenAI, LLM & RAG',
    description: 'Generative AI, LLM & RAG — GeeksforGeeks (Dec 2025)',
    links: {
      live: 'https://media.geeksforgeeks.org/courses/certificates/bffbd6be892280341b8a5f0609072099.pdf',
    },
  },
  {
    id: 'cert-ml-stanford',
    label: 'ML: Regression & Classification',
    description:
      'Supervised Machine Learning — DeepLearning.AI, Stanford University (Nov 2024)',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/verify/8BDBW0E8L3LC',
    },
  },
  {
    id: 'cert-prompt-eng',
    label: 'Prompt Engineering',
    description:
      'Prompt Engineering for ChatGPT — Vanderbilt University (Mar 2024)',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/verify/RPYCF9X32AE6',
    },
  },
  {
    id: 'cert-genai-everyone',
    label: 'GenAI for Everyone',
    description: 'Generative AI for Everyone — Coursera (Nov 2023)',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/certificate/XZ5QG5NBFQRA',
    },
  },
  {
    id: 'cert-sql',
    label: 'SQL for Data Science',
    description:
      'Databases and SQL for Data Science with Python — Coursera (May 2023)',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/certificate/KY99XLFNJFWS',
    },
  },
  {
    id: 'cert-docker',
    label: 'Docker Training',
    description: 'Docker Training Course — KodeKloud (Mar 2023)',
    links: {
      live: 'https://learn.kodekloud.com/certificate/2D064B1166E9-2D06450CDFED-2D063F735021',
    },
  },
]

// 30° offset interleaves the cert ring between blog positions
const certNodes: Node[] = certDefs.map((c, i) => {
  const theta = Math.PI / 6 + i * ((2 * Math.PI) / certDefs.length)
  return {
    ...c,
    type: 'cert',
    color: '#34d399',
    size: 0.5,
    position: [
      CERT_RADIUS * Math.cos(theta),
      (i - 2.5) * 1.8 + jitter(0.4),
      CERT_RADIUS * Math.sin(theta),
    ],
  }
})

const INFO_RADIUS = 11

const infoDefs = [
  {
    id: 'experience',
    label: 'MITU Skillologies',
    description:
      'Data Scientist (2023–Present). Deep learning research on Brahmi script recognition, RAG pipeline development, and technical training across 10+ industry engagements reaching 2,000+ professionals.',
    size: 0.7,
  },
  {
    id: 'edu-cdac',
    label: 'CDAC ACTS',
    description: 'PG Diploma in Artificial Intelligence (2023)',
    size: 0.5,
  },
  {
    id: 'edu-sppu',
    label: 'SPPU',
    description: 'B.Tech — Civil Engineering, CGPA: 7.78 (2021)',
    size: 0.5,
  },
]

const infoNodes: Node[] = infoDefs.map((d, i) => {
  const y = (i - 1) * 4
  const ringRadius = Math.sqrt(INFO_RADIUS ** 2 - y ** 2)
  const theta = 1 + i * ((2 * Math.PI) / infoDefs.length)
  return {
    ...d,
    type: 'info',
    color: '#fbbf24',
    position: [
      ringRadius * Math.cos(theta),
      y + jitter(0.4),
      ringRadius * Math.sin(theta),
    ],
  }
})

export const nodes: Node[] = [
  ...projectNodes,
  ...categoryNodes,
  ...skillNodes,
  ...blogNodes,
  ...certNodes,
  ...infoNodes,
]

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

const blogSkillEdges: Edge[] = [
  { source: 'blog-graph-rag', target: 'rag' },
  { source: 'blog-cbow', target: 'nlp' },
  { source: 'blog-rnn', target: 'nlp' },
  { source: 'blog-prompts', target: 'prompt-eng' },
]

const certSkillEdges: Edge[] = [
  { source: 'cert-genai-rag', target: 'rag' },
  { source: 'cert-genai-rag', target: 'llm' },
  { source: 'cert-genai-rag', target: 'langchain' },
  { source: 'cert-ml-stanford', target: 'sklearn' },
  { source: 'cert-prompt-eng', target: 'prompt-eng' },
  { source: 'cert-genai-everyone', target: 'llm' },
  { source: 'cert-sql', target: 'sql' },
  { source: 'cert-docker', target: 'docker' },
]

const infoEdges: Edge[] = [
  { source: 'experience', target: 'cat-genai' },
  { source: 'experience', target: 'cat-mldl' },
  { source: 'experience', target: 'cat-mlops' },
  { source: 'edu-cdac', target: 'experience' },
  { source: 'edu-sppu', target: 'experience' },
]

export const edges: Edge[] = [
  ...categorySkillEdges,
  ...projectSkillEdges,
  ...projectCategoryEdges,
  ...blogSkillEdges,
  ...certSkillEdges,
  ...infoEdges,
]

// Adjacency map for hover neighborhood highlighting
export const neighbors = new Map<string, Set<string>>()
for (const e of edges) {
  if (!neighbors.has(e.source)) neighbors.set(e.source, new Set())
  if (!neighbors.has(e.target)) neighbors.set(e.target, new Set())
  neighbors.get(e.source)!.add(e.target)
  neighbors.get(e.target)!.add(e.source)
}
