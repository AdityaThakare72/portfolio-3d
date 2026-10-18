// Extra words the job-description matcher accepts for a skill, besides the
// skill's own label. Only add true synonyms — a match should never claim a
// skill that isn't on the site. Keys are skill ids from portfolio.ts.
export const skillAliases: Record<string, string[]> = {
  sql: ['mysql'],
  rag: ['retrieval-augmented generation', 'retrieval augmented generation'],
  'agentic-ai': ['agentic', 'ai agents', 'llm agents', 'multi-agent', 'multi agent'],
  llm: ['llm', 'large language model', 'large language models'],
  'gemini-api': ['gemini'],
  'openai-api': ['openai', 'gpt-4', 'gpt-4o', 'gpt-4o-mini'],
  'prompt-eng': ['prompt engineering', 'prompting', 'prompt design'],
  chromadb: ['chroma', 'vector database', 'vector databases', 'vector store', 'vector stores', 'vector db'],
  huggingface: ['huggingface'],
  'gemini-embed': ['embeddings', 'embedding models'],
  'semantic-chunk': ['chunking'],
  sklearn: ['scikit-learn', 'sklearn', 'scikit learn'],
  xgboost: ['gradient boosting'],
  cnn: ['cnn', 'convolutional neural network', 'convolutional neural networks'],
  nlp: ['natural language processing'],
  'rest-apis': ['rest', 'restful', 'rest api'],
  docker: ['containers', 'containerization', 'containerisation'],
  cicd: ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment', 'continuous delivery'],
  'ssl-https': ['ssl', 'https', 'tls'],
  powerbi: ['powerbi'],
}

// Broader terms a job description may use for a whole skill category
export const categoryAliases: Record<string, string[]> = {
  'cat-genai': ['generative ai', 'genai', 'gen ai'],
  'cat-mldl': ['machine learning', 'deep learning', 'ml'],
  'cat-mlops': ['mlops', 'devops'],
  'cat-backend': ['backend', 'back-end', 'api development'],
  'cat-dataviz': ['data visualization', 'data visualisation', 'dashboards', 'data analysis'],
}
