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
  // Certificate credential ID, shown in the cert panel
  credentialId?: string
  // Project write-up shown in the panel: problem -> key decision -> outcome
  story?: ProjectStory
  // Path to a demo GIF / MP4 in public/, e.g. '/media/research-agent.gif'
  media?: string
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
export const HEADLINE = 'Data Scientist | GenAI & Agentic AI | MLOps'

export const SUMMARY = `Data Scientist with 3+ years of experience (since Sep 2023) building and deploying Generative AI systems: RAG pipelines, multi-agent LangGraph orchestration and end-to-end MLOps workflows. Delivered technical training to 2,000+ students and faculty across ${teachingStats.workshops} workshops and faculty development programs at ${teachingStats.institutions} institutions.`

// Shown on the readable page, the 3D hero and About
export const AVAILABILITY =
  'Open to Data Scientist / AI Engineer roles · Pune, remote, or relocation'

// One hue per node type, so every color has a single meaning:
// sky = projects, violet = skills, pink = blogs, emerald = certs,
// amber = the person (experience, teaching, education)
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
  // TODO: record a 20–40s demo GIF/MP4 per shipped project, put it in
  // public/media/ and set media: '/media/<file>' on the project below
  media?: string
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
    story: {
      problem: 'Single-pass AI research outputs tend to be shallow.',
      decision: "LangGraph over LangChain's AgentExecutor, for native cyclic graph support, persistent typed state and deterministic control flow.",
      outcome: "The Writer only loops back when the Critic's score falls below the threshold, which prevents both infinite loops and premature termination.",
    },
  },
  {
    id: 'legal-agent',
    label: 'Conversational Legal Agent',
    shortLabel: 'Legal Agent',
    description:
      'Conversational RAG agent for Indian law. Scraping, preprocessing and semantic chunking of legal data; ChromaDB for persistent retrieval; Gemini embeddings. First self-hosted on DigitalOcean with Nginx, SSL and systemd, now deployed on Streamlit Community Cloud.',
    links: {
      live: 'https://legal-agent-i.streamlit.app/',
      source: 'https://github.com/AdityaThakare72/Legal_Agent1',
    },
    tags: ['RAG', 'LangChain', 'ChromaDB', 'Gemini API', 'Streamlit', 'Nginx'],
    story: {
      problem: "Legal information is hard to access for people who can't afford a legal consultation.",
      decision: 'ChromaDB over FAISS for persistent storage, so retrieval keeps its state without re-embedding.',
      outcome: 'Deployed and publicly usable; first self-hosted on DigitalOcean, now on Streamlit Community Cloud.',
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
    story: {
      problem: 'Unplanned manufacturing downtime is expensive.',
      decision: 'XGBoost over neural alternatives for tabular sensor data in a low-data regime.',
      outcome: '98.3% accuracy and 91.2% F1 on imbalanced sensor data, with scale_pos_weight tuning.',
    },
  },
  {
    id: 'ceo-dashboard',
    label: 'CEO Financial Dashboard',
    shortLabel: 'CEO Dashboard',
    description:
      'Client project, in production. LangGraph orchestration behind a FastAPI layer; DuckDB/Parquet for analytical queries, MongoDB for metadata; Pydantic structured outputs with GPT-4o-mini for schema-validated answers to financial questions.',
    // client project — no public links
    tags: ['LangGraph', 'FastAPI', 'DuckDB', 'Parquet', 'MongoDB', 'Pydantic', 'GPT-4o-mini'],
    story: {
      problem: 'C-suite executives needed answers to financial questions in natural language.',
      decision: 'Pydantic structured outputs with GPT-4o-mini, so every answer is schema-validated.',
      outcome: 'Running in production for the client.',
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
    id: 'typed-decision-models',
    label: 'typed-decision-models',
    description:
      'Comparing typed decision models (Laya, Jev) with a fine-tuned BERT baseline on accuracy and latency.',
    links: {
      source: 'https://github.com/AdityaThakare72/typed-decision-models',
    },
    status: 'in-progress',
    // TODO: confirm tags against the repo once its README is written
    tags: ['NLP', 'BERT'],
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

const infoDefs = [
  {
    id: 'experience',
    label: 'MITU Skillologies',
    description: 'Data Scientist · Pune · Sep 2023 – Present',
    highlights: [
      'Deep learning research support on Brahmi script recognition: compared Custom CNN, InceptionNet, ResNet-50 and XceptionNet on a 7,880-image, 56-class dataset; ResNet-50 gave the best accuracy.',
      'Research and implementation support for student progression prediction and crop disease classification.',
      `Built end-to-end AI systems (RAG pipelines, neural networks, MLOps workflows) as primary technical SME across ${teachingStats.workshops} workshops and faculty development programs, reaching 2,000+ students and faculty.`,
      'Designed a 140-session AI curriculum, Python through Generative AI and LangGraph.',
    ],
    size: 0.7,
  },
  {
    id: 'teaching',
    label: 'Teaching',
    description: `${teachingStats.workshops} workshops and faculty development programs for students and faculty at ${teachingStats.institutions} institutions (${teachingStats.from}–${teachingStats.to}), reaching 2,000+ people.`,
    size: 0.6,
  },
  {
    id: 'edu-cdac',
    label: 'CDAC ACTS, Pune',
    description: 'PG Diploma in Artificial Intelligence (2023)',
    size: 0.5,
  },
  {
    id: 'edu-sppu',
    label: 'SPPU',
    description:
      'B.Tech, Civil Engineering — Savitribai Phule Pune University · CGPA 7.78 (2021)',
    size: 0.5,
  },
]

const infoNodes: Node[] = infoDefs.map((d, i) => {
  const y = (i - (infoDefs.length - 1) / 2) * 4
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
  ['ceo-dashboard', ['langgraph', 'agentic-ai', 'fastapi', 'pydantic', 'openai-api']],
  ['react-from-scratch', ['python', 'agentic-ai', 'llm']],
  ['typed-decision-models', ['nlp']],
  ['agent-harness-demo', ['agentic-ai', 'python', 'gemini-api']],
].flatMap(([source, targets]) =>
  (targets as string[]).map((target) => ({ source: source as string, target })),
)

const projectCategoryEdges: Edge[] = [
  ['research-agent', ['cat-genai', 'cat-backend', 'cat-mlops']],
  ['legal-agent', ['cat-genai', 'cat-vectorstores', 'cat-backend', 'cat-mlops']],
  ['equipment-maintenance', ['cat-mldl', 'cat-backend', 'cat-mlops']],
  ['ceo-dashboard', ['cat-genai', 'cat-backend']],
  ['react-from-scratch', ['cat-genai', 'cat-languages']],
  ['typed-decision-models', ['cat-mldl']],
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
  { source: 'experience', target: 'cat-genai' },
  { source: 'experience', target: 'cat-mldl' },
  { source: 'experience', target: 'cat-mlops' },
  { source: 'teaching', target: 'experience' },
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
