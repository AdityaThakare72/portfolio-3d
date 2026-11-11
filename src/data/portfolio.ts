import { teachingStats } from './workshops'

export type NodeType = 'project' | 'category' | 'skill' | 'blog' | 'cert' | 'info'

export interface Node {
  id: string
  type: NodeType
  label: string
  // Shorter text for the 3D label when the full name is long; panels and
  // the readable page always use the full label
  shortLabel?: string
  description: string
  color: string
  size: number
  position: [number, number, number]
  links?: { live?: string; source?: string }
  tags?: string[]
  // Projects still being built — shows an "In progress" badge
  status?: 'in-progress'
  // Bullet points for experience nodes
  highlights?: string[]
  // About-me nodes: which section they belong to, and the job title
  kind?: 'experience' | 'education' | 'oss'
  role?: string
  // Client work running in production; counted as a deployed AI system
  inProduction?: boolean
  // Open-source PRs: shown as a badge so an open PR never reads as merged
  prStatus?: 'merged' | 'open'
  // Certificate credential ID, shown in the cert panel
  credentialId?: string
  // Project write-up shown in the panel: problem -> key decision -> outcome
  story?: ProjectStory
  // Path to a demo GIF / MP4 in public/, e.g. '/demos/research.mp4'
  media?: string
  // Caption under the demo, e.g. how it was recorded
  mediaNote?: string
}

export interface ProjectStory {
  problem: string
  decision: string
  outcome: string
}

export interface Edge {
  source: string
  target: string
}

// Intro copy shared by the readable page, the 3D hero and the About modal
// Keep HEADLINE in step with the resume headline and the GitHub bio
export const HEADLINE = 'AI Engineer'
export const TAGLINE = 'Agent backends, RAG and MLOps'

export const SUMMARY =
  "I build agent backends that run in production. On contract for Neon AI, I took over a legacy LangGraph codebase and shipped the agentic backend of an executive finance dashboard: async FastAPI, DuckDB over Parquet, MongoDB, and Pydantic-validated output on every model call. In open source, I have a merged PR in caura-ai's platform for long-running agents and two bug-fix PRs open on langchain-ai/langchain-mongodb. I also measure before I build: in my router benchmark, a 5 MB XGBoost model matched a 1.6 GB fine-tuned transformer and both beat an LLM router."

// Shown on the readable page, the 3D hero and About
export const AVAILABILITY = 'Open to AI Engineer roles · Pune, remote, or relocation'

// One hue per node type, so every color has a single meaning:
// sky = projects, violet = skills, pink = blogs, emerald = certs,
// amber = the person (experience, open source, education)
export const COLORS = {
  background: '#030712',
  project: '#38bdf8',
  category: '#a78bfa',
  blog: '#f472b6',
  cert: '#34d399',
  info: '#fbbf24',
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

// Dim a hex color toward black — used for skill nodes, a darker shade of
// the category violet
export function dim(hex: string, factor = 0.62): string {
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
  shortLabel?: string
  description: string
  links?: { live?: string; source?: string }
  tags: string[]
  status?: 'in-progress'
  story?: ProjectStory
  // Demo video/GIF in public/ (see EDITING_GUIDE.md) and its caption
  media?: string
  mediaNote?: string
}

const projectDefs: ProjectDef[] = [
  {
    id: 'research-agent',
    label: 'Agentic Research System',
    shortLabel: 'Research Agent',
    description:
      "LangGraph multi-agent research system: Researcher (Tavily + Gemini), Writer and Critic agents sharing a TypedDict state. Conditional edges loop back through the Writer until the Critic's score clears a threshold. Deployed on Streamlit.",
    links: {
      live: 'https://research-agent-blog.streamlit.app/',
      source: 'https://github.com/AdityaThakare72/Research-Agent',
    },
    tags: ['LangGraph', 'LangChain', 'Gemini API', 'Tavily', 'Streamlit', 'Docker'],
    media: '/demos/research.mp4',
    mediaNote: 'Recorded from the live demo · sped up 2.5×',
    story: {
      problem: 'Single-pass AI research outputs tend to be shallow.',
      decision: "LangGraph over LangChain's AgentExecutor, for native cyclic graph support, persistent typed state and deterministic control flow.",
      outcome: "The Writer only loops back when the Critic's score falls below the threshold, which prevents both infinite loops and premature termination.",
    },
  },
  {
    id: 'typed-decision-models',
    label: 'Typed Decision Models: Agent Router Benchmark',
    shortLabel: 'Typed Decision Models',
    description:
      'Benchmark of Laya, a typed decision model from Hugging Face, as the router of an agent workflow: route, priority and needs-human decisions from support-ticket text plus tabular metadata, against Random Forest, XGBoost, a fine-tuned BERT and a Gemini LLM router inside a LangGraph workflow.',
    links: {
      source: 'https://github.com/AdityaThakare72/typed-decision-models',
    },
    story: {
      problem:
        'Agent workflows need a fast, reliable router step that turns a request into a few structured fields, which LLM routers make slow and costly.',
      decision:
        'Put every model behind one DecisionModel interface with the same metrics and p50/p95 latency, and fine-tuned Laya on the task instead of relying on zero-shot.',
      outcome:
        'On a synthetic benchmark, fine-tuned Laya beat the Gemini router by 25 points on exact match (0.76 vs 0.51), ~21x faster and ~80x cheaper; XGBoost matched it (0.736 vs 0.720) at ~300x smaller.',
    },
    tags: ['Hugging Face', 'LangGraph', 'BERT', 'XGBoost', 'Gemini API', 'Python'],
  },
  {
    id: 'legal-agent',
    label: 'Conversational Legal Agent',
    shortLabel: 'Legal Agent',
    description:
      'Conversational RAG agent for Indian law that answers with cited sources. Knowledge base of about 70K chunks across 1,000+ Indian acts, including the 2023 criminal codes (BNS, BNSS, BSA). Hybrid retrieval (BM25 plus vector search, merged with Reciprocal Rank Fusion), category filtering, a classifier and a reranker, with streaming answers. Gemini embeddings, ChromaDB; deployed on Streamlit Community Cloud.',
    links: {
      live: 'https://legal-agent-i.streamlit.app/',
      source: 'https://github.com/AdityaThakare72/Legal-Agent-v2',
    },
    tags: ['RAG', 'Hybrid Search', 'BM25', 'ChromaDB', 'Gemini API', 'Streamlit'],
    media: '/demos/legal.mp4',
    mediaNote: 'Recorded from the live demo · sped up 2.3×',
    story: {
      problem: "Legal information is hard to access for people who can't afford a legal consultation.",
      decision: 'Hybrid BM25 + vector retrieval fused with Reciprocal Rank Fusion, because legal questions mix exact section numbers (keyword search) with plain-language meaning (vector search).',
      outcome: 'Grew the knowledge base from ~4K to ~70K chunks; deployed and publicly usable with source citations on every answer.',
    },
  },
  {
    id: 'equipment-maintenance',
    label: 'Industrial Equipment Maintenance',
    shortLabel: 'Equipment Maintenance',
    description:
      'XGBoost predictive maintenance classifier, 98.3% accuracy and 91.2% F1 on imbalanced sensor data (scale_pos_weight). DVC pipeline, MLflow tracking, FastAPI inference API in Docker on Render, Streamlit dashboard, GitHub Actions CI (ruff + pytest).',
    links: {
      live: 'https://industrial-equipment-maintenance.streamlit.app/',
      source: 'https://github.com/AdityaThakare72/Industrial_Equipment_Maintenance',
    },
    tags: ['XGBoost', 'FastAPI', 'MLflow', 'DVC', 'Docker', 'GitHub Actions', 'Render', 'Streamlit'],
    media: '/demos/equipment.mp4',
    mediaNote: 'Recorded from the live demo',
    story: {
      problem: 'Unplanned manufacturing downtime is expensive.',
      decision: 'XGBoost over neural alternatives for tabular sensor data in a low-data regime.',
      outcome: '98.3% accuracy and 91.2% F1 on imbalanced sensor data, with scale_pos_weight tuning.',
    },
  },
  {
    id: 'react-from-scratch',
    label: 'react-from-scratch',
    description:
      'ReAct (Yao et al., ICLR 2023) reimplemented in plain Python, no LangChain: tool registry, output parser, and a ReAct vs Act-only vs CoT evaluation.',
    links: {
      source: 'https://github.com/AdityaThakare72/react-from-scratch',
    },
    status: 'in-progress',
    // TODO: confirm tags against the repo once its README is written
    tags: ['Python', 'Agentic AI', 'LLMs'],
  },
  {
    id: 'agent-harness-demo',
    label: 'agent-harness-demo',
    description:
      'Minimal agent harness built in stages (v0 to v4) with a Gemini adapter.',
    links: {
      source: 'https://github.com/AdityaThakare72/agent-harness-demo',
    },
    tags: ['Agentic AI', 'Python', 'Gemini API'],
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
      (i - (projectDefs.length - 1) / 2) * 2,
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
  skills: { id: string; label: string }[]
}

const categoryDefs: CategoryDef[] = [
  {
    id: 'cat-languages',
    label: 'Languages',
    skills: [
      { id: 'python', label: 'Python' },
      { id: 'sql', label: 'SQL' },
    ],
  },
  {
    id: 'cat-genai',
    label: 'Generative AI',
    skills: [
      { id: 'rag', label: 'RAG' },
      { id: 'agentic-ai', label: 'Agentic AI' },
      { id: 'llm', label: 'LLMs' },
      { id: 'langgraph', label: 'LangGraph' },
      { id: 'langchain', label: 'LangChain' },
      { id: 'gemini-api', label: 'Gemini API' },
      { id: 'openai-api', label: 'OpenAI API' },
      { id: 'prompt-eng', label: 'Prompt Engineering' },
    ],
  },
  {
    id: 'cat-vectorstores',
    label: 'Vector Stores & Embeddings',
    skills: [
      { id: 'chromadb', label: 'ChromaDB' },
      { id: 'pinecone', label: 'Pinecone' },
      { id: 'huggingface', label: 'Hugging Face' },
      { id: 'gemini-embed', label: 'Gemini Embeddings' },
      { id: 'semantic-chunk', label: 'Semantic Chunking' },
    ],
  },
  {
    id: 'cat-mldl',
    label: 'ML / Deep Learning',
    skills: [
      { id: 'sklearn', label: 'Scikit-learn' },
      { id: 'xgboost', label: 'XGBoost' },
      { id: 'pytorch', label: 'PyTorch' },
      { id: 'tensorflow', label: 'TensorFlow' },
      { id: 'keras', label: 'Keras' },
      { id: 'cnn', label: 'CNNs' },
      { id: 'nlp', label: 'NLP' },
      { id: 'transfer-learning', label: 'Transfer Learning' },
    ],
  },
  {
    id: 'cat-backend',
    label: 'Backend & APIs',
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
    skills: [
      { id: 'docker', label: 'Docker' },
      { id: 'nginx', label: 'Nginx' },
      { id: 'github-actions', label: 'GitHub Actions' },
      { id: 'cicd', label: 'CI/CD' },
      { id: 'mlflow', label: 'MLflow' },
      { id: 'dvc', label: 'DVC' },
      { id: 'systemd', label: 'systemd' },
      { id: 'ssl-https', label: 'SSL/HTTPS' },
    ],
  },
  {
    id: 'cat-dataviz',
    label: 'Data & Visualization',
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
    color: COLORS.category,
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
      color: dim(COLORS.category),
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
    color: COLORS.blog,
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
    id: 'cert-iimb-genai',
    label: 'GenAI & LLMs',
    description:
      'Generative AI and Large Language Models — IIM Bangalore (SWAYAM) · Jul – Nov 2024',
    links: {
      live: 'https://onlinecourses.swayam2.ac.in/imb24_mg116/certificate?q=aZPMs7O/ZaHSTGa3paC5N3K18lOXUib4z%2BfTysE4W7UEtfEd/ZxsfiLrPwechPHb',
    },
  },
  {
    id: 'cert-genai-rag',
    label: 'GenAI, LLM & RAG',
    description: 'Generative AI, LLM & RAG - Skill Up — GeeksforGeeks · Dec 2025',
    links: {
      live: 'https://media.geeksforgeeks.org/courses/certificates/bffbd6be892280341b8a5f0609072099.pdf',
    },
  },
  {
    id: 'cert-ml-stanford',
    label: 'ML: Regression & Classification',
    description:
      'Supervised Machine Learning: Regression and Classification — DeepLearning.AI, Stanford University · Nov 2024',
    credentialId: '8BDBW0E8L3LC',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/records/8BDBW0E8L3LC',
    },
  },
  {
    id: 'cert-prompt-eng',
    label: 'Prompt Engineering',
    description: 'Prompt Engineering for ChatGPT — Vanderbilt University · Mar 2024',
    credentialId: 'RPYCF9X32AE6',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/records/RPYCF9X32AE6',
    },
  },
  {
    id: 'cert-python',
    label: 'Python Skill Up',
    description: 'Python Skill Up — GeeksforGeeks · Dec 2025',
    links: {
      live: 'https://media.geeksforgeeks.org/courses/certificates/9e43a4eff794f8bdcc292fe22aec3966.pdf',
    },
  },
  {
    id: 'cert-sql',
    label: 'SQL for Data Science',
    description:
      'Databases and SQL for Data Science with Python — Coursera · May 2023',
    credentialId: 'KY99XLFNJFWS',
    links: {
      live: 'https://www.coursera.org/account/accomplishments/certificate/KY99XLFNJFWS',
    },
  },
  {
    id: 'cert-docker',
    label: 'Docker Training',
    description:
      'Docker Training Course for the Absolute Beginner — KodeKloud · Mar 2023',
    // no public link — credential ID only
    credentialId: '2D064B1166E9-2D06450CDFED-2D063F735021',
  },
]

// 30° offset interleaves the cert ring between blog positions
const certNodes: Node[] = certDefs.map((c, i) => {
  const theta = Math.PI / 6 + i * ((2 * Math.PI) / certDefs.length)
  return {
    ...c,
    type: 'cert',
    color: COLORS.cert,
    size: 0.5,
    position: [
      CERT_RADIUS * Math.cos(theta),
      (i - (certDefs.length - 1) / 2) * 1.8 + jitter(0.4),
      CERT_RADIUS * Math.sin(theta),
    ],
  }
})

const INFO_RADIUS = 11

// Typed loosely so each entry only sets the fields it needs
const infoDefs: Omit<Node, 'type' | 'color' | 'position'>[] = [
  {
    id: 'neon-ai',
    kind: 'experience',
    label: 'Neon AI',
    role: 'AI Consultant & Developer (Contract)',
    description: 'May 2026 – Jul 2026',
    highlights: [
      'Built the agentic backend of a production executive analytics dashboard: a LangGraph multi-agent pipeline behind async FastAPI that answers natural-language financial questions. Scoped as 3 deliverables; grew into a multi-agent system over 45 days.',
      'Took over a legacy LangGraph codebase and migrated it live with a strangler-fig approach, serving modern REST endpoints alongside the legacy ones so the frontend kept working throughout.',
      'Grounded every answer in data: DuckDB over Parquet for evidence queries, async MongoDB (Motor) for metadata, and Pydantic structured output on every GPT-4o-mini call through Azure OpenAI, so no unvalidated model text reaches the UI.',
      'Built a monitoring and root-cause-analysis agent system for the pipeline; handled chain concurrency with asyncio locks in a constrained single-node environment, where Redis and Celery were not an option.',
      'Evaluated Gemini Flash, Claude Haiku, DeepSeek and Groq-hosted models as replacements for GPT-4o-mini, then wrote the completion report and ran the handover to the incoming developer.',
      'Architecture comprises 8 graph nodes, exposes 4 primary endpoints, and handles average responses in ~4 seconds for simple queries and ~12 seconds for deep analytical queries.',
    ],
    tags: [
      'LangGraph',
      'FastAPI',
      'DuckDB',
      'Parquet',
      'MongoDB',
      'Motor',
      'Pydantic',
      'Azure OpenAI',
      'GPT-4o-mini',
      'asyncio',
    ],
    inProduction: true,
    size: 0.7,
  },
  {
    id: 'experience',
    kind: 'experience',
    label: 'MITU Skillologies',
    role: 'Data Scientist',
    description: 'Pune · Sep 2023 – Present',
    highlights: [
      "Built the reference GenAI systems behind the company's programmes: LangChain and LangGraph RAG and agent pipelines, fine-tuning workflows, and MLOps setups with Docker, MLflow, DVC and CI.",
      'Benchmarked four CNN architectures (custom CNN, InceptionNet, ResNet-50, XceptionNet) for Brahmi script recognition on a 7,880-image, 56-class dataset; ResNet-50 gave the best accuracy. Supported applied ML work on student progression prediction and crop disease classification.',
      `Primary technical SME for the GenAI and agentic AI programmes (LangGraph, RAG, MCP), delivered to 2,000+ engineering students and faculty across ${teachingStats.institutions} institutions.`,
    ],
    size: 0.7,
  },
  {
    id: 'oss-caura-fleet',
    kind: 'oss',
    label: 'caura-long-run-fleet',
    role: 'caura-ai',
    prStatus: 'merged',
    description:
      'Platform for long-running AI agents. Added a configurable per-agent subprocess timeout to the fleet simulator, with input validation and docs (fixes issue #36). Reviewed and merged Oct 2026.',
    links: { source: 'https://github.com/caura-ai/caura-long-run-fleet/pull/43' },
    tags: ['Python', 'Agentic AI', 'Open source'],
    size: 0.5,
  },
  {
    id: 'oss-langchain-mongodb-487',
    kind: 'oss',
    label: 'langchain-mongodb',
    shortLabel: 'langchain-mongodb #487',
    role: 'langchain-ai',
    prStatus: 'open',
    description:
      "Fix for LangGraph's MongoDBStore: suffix wildcards in list_namespaces matched at the wrong positions, and limit counted documents instead of unique namespaces. Includes offline tests that check behaviour against InMemoryStore (fixes issue #480).",
    links: { source: 'https://github.com/langchain-ai/langchain-mongodb/pull/487' },
    tags: ['Python', 'LangGraph', 'MongoDB', 'Open source'],
    size: 0.5,
  },
  {
    id: 'oss-langchain-mongodb-486',
    kind: 'oss',
    label: 'langchain-mongodb',
    shortLabel: 'langchain-mongodb #486',
    role: 'langchain-ai',
    prStatus: 'open',
    description:
      "Fix for LangGraph's MongoDBStore: put and batch lost track of which text belonged to which item when some items were stored without indexing (fixes issue #479).",
    links: { source: 'https://github.com/langchain-ai/langchain-mongodb/pull/486' },
    tags: ['Python', 'LangGraph', 'MongoDB', 'Open source'],
    size: 0.5,
  },
  {
    id: 'edu-cdac',
    kind: 'education',
    label: 'CDAC ACTS, Pune',
    description: 'PG Diploma in Artificial Intelligence (2023)',
    size: 0.5,
  },
  {
    id: 'edu-sppu',
    kind: 'education',
    label: 'SPPU',
    description:
      'B.Tech, Civil Engineering — Savitribai Phule Pune University · CGPA 7.78 (2021)',
    size: 0.5,
  },
]

const infoNodes: Node[] = infoDefs.map((d, i) => {
  const y = (i - (infoDefs.length - 1) / 2) * 3
  const ringRadius = Math.sqrt(INFO_RADIUS ** 2 - y ** 2)
  const theta = 1 + i * ((2 * Math.PI) / infoDefs.length)
  return {
    ...d,
    type: 'info',
    color: COLORS.info,
    position: [
      ringRadius * Math.cos(theta),
      y + jitter(0.4),
      ringRadius * Math.sin(theta),
    ],
  }
})

// Counted from the data, so the stat grows as projects ship: a project is
// deployed when it has a live demo or is a client project (no public links).
// Client work listed under experience counts when it has inProduction.
// In-progress work never counts.
const isDeployed = (p: ProjectDef) =>
  p.status !== 'in-progress' && (!!p.links?.live || !p.links)

export const projectStats = {
  deployed:
    projectDefs.filter(isDeployed).length + infoDefs.filter((d) => d.inProduction).length,
  // Other projects with public code, built or still in progress
  onGithub: projectDefs.filter((p) => !isDeployed(p) && p.links?.source).length,
}

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
  ['research-agent', ['agentic-ai', 'langgraph', 'langchain', 'gemini-api', 'streamlit', 'docker']],
  ['legal-agent', ['rag', 'langchain', 'chromadb', 'gemini-api', 'gemini-embed', 'semantic-chunk', 'streamlit', 'nginx', 'systemd', 'ssl-https']],
  ['equipment-maintenance', ['xgboost', 'fastapi', 'mlflow', 'dvc', 'docker', 'github-actions', 'cicd', 'streamlit']],
  ['react-from-scratch', ['python', 'agentic-ai', 'llm']],
  ['typed-decision-models', ['huggingface', 'langgraph', 'agentic-ai', 'llm', 'gemini-api', 'xgboost', 'sklearn', 'nlp', 'transfer-learning', 'python']],
  ['agent-harness-demo', ['agentic-ai', 'python', 'gemini-api']],
].flatMap(([source, targets]) =>
  (targets as string[]).map((target) => ({ source: source as string, target })),
)

const projectCategoryEdges: Edge[] = [
  ['research-agent', ['cat-genai', 'cat-backend', 'cat-mlops']],
  ['legal-agent', ['cat-genai', 'cat-vectorstores', 'cat-backend', 'cat-mlops']],
  ['equipment-maintenance', ['cat-mldl', 'cat-backend', 'cat-mlops']],
  ['react-from-scratch', ['cat-genai', 'cat-languages']],
  ['typed-decision-models', ['cat-mldl', 'cat-genai', 'cat-vectorstores', 'cat-languages']],
  ['agent-harness-demo', ['cat-genai', 'cat-languages']],
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
  { source: 'cert-iimb-genai', target: 'llm' },
  { source: 'cert-genai-rag', target: 'rag' },
  { source: 'cert-genai-rag', target: 'llm' },
  { source: 'cert-genai-rag', target: 'langchain' },
  { source: 'cert-ml-stanford', target: 'sklearn' },
  { source: 'cert-prompt-eng', target: 'prompt-eng' },
  { source: 'cert-python', target: 'python' },
  { source: 'cert-sql', target: 'sql' },
  { source: 'cert-docker', target: 'docker' },
]

const infoEdges: Edge[] = [
  ...['langgraph', 'agentic-ai', 'fastapi', 'pydantic', 'openai-api', 'cat-genai', 'cat-backend'].map(
    (target) => ({ source: 'neon-ai', target }),
  ),
  { source: 'neon-ai', target: 'experience' },
  { source: 'oss-caura-fleet', target: 'agentic-ai' },
  { source: 'oss-caura-fleet', target: 'python' },
  ...['oss-langchain-mongodb-487', 'oss-langchain-mongodb-486'].flatMap((source) => [
    { source, target: 'langgraph' },
    { source, target: 'python' },
  ]),
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

// Work the job matcher can cite as evidence: projects, jobs and open source
export const isWork = (n?: Node) =>
  n?.type === 'project' || n?.kind === 'experience' || n?.kind === 'oss'

// Where a node lives on the readable page
export const pageAnchor = (n: Node) =>
  n.type === 'project'
    ? `#project-${n.id}`
    : n.kind === 'oss'
      ? '#open-source'
      : n.kind
        ? `#${n.kind}`
        : undefined

// Adjacency map for hover neighborhood highlighting
export const neighbors = new Map<string, Set<string>>()
for (const e of edges) {
  if (!neighbors.has(e.source)) neighbors.set(e.source, new Set())
  if (!neighbors.has(e.target)) neighbors.set(e.target, new Set())
  neighbors.get(e.source)!.add(e.target)
  neighbors.get(e.target)!.add(e.source)
}
