// Extra words the job-description matcher accepts for a skill, besides the
// skill's own label. Only add true synonyms — a match should never claim a
// skill that isn't on the site. Keys are skill ids from portfolio.ts.
export const skillAliases: Record<string, string[]> = {
  sql: ['mysql'],
  rag: ['retrieval-augmented generation', 'retrieval augmented generation'],
  'agentic-ai': ['agentic', 'ai agents', 'llm agents', 'multi-agent', 'multi agent'],
  llm: ['llm', 'large language model', 'large language models'],
  mcp: ['model context protocol'],
  'gemini-api': ['gemini'],
  'openai-api': ['openai', 'azure openai', 'gpt-4', 'gpt-4o', 'gpt-4o-mini'],
  chromadb: ['chroma', 'vector database', 'vector databases', 'vector store', 'vector stores', 'vector db'],
  'hybrid-search': ['hybrid search', 'hybrid retrieval', 'bm25', 'reciprocal rank fusion'],
  huggingface: ['huggingface'],
  'gemini-embed': ['embeddings', 'embedding models'],
  'semantic-chunk': ['chunking'],
  sklearn: ['scikit-learn', 'sklearn', 'scikit learn'],
  xgboost: ['gradient boosting'],
  'tf-keras': ['tensorflow', 'keras'],
  'transfer-learning': ['fine-tuning', 'fine tuning', 'finetuning', 'transfer learning'],
  cnn: ['cnn', 'convolutional neural network', 'convolutional neural networks'],
  nlp: ['natural language processing'],
  asyncio: ['async python', 'asynchronous python'],
  mongodb: ['mongo'],
  docker: ['containers', 'containerization', 'containerisation'],
  'github-actions': [
    'github actions',
    'ci/cd',
    'ci cd',
    'continuous integration',
    'continuous deployment',
    'continuous delivery',
  ],
}

// Broader terms a job description may use for a whole skill category
export const categoryAliases: Record<string, string[]> = {
  'cat-genai': ['generative ai', 'genai', 'gen ai'],
  'cat-mldl': ['machine learning', 'deep learning', 'ml'],
  'cat-mlops': ['mlops', 'devops'],
  'cat-backend': ['backend', 'back-end', 'api development'],
}
