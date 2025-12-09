// ==========================================
// RAG (Retrieval-Augmented Generation) System Core
// ==========================================

// src/modules/ai-chat/rag/interfaces/rag-config.interface.ts
export interface RAGConfig {
  embeddingModel: string;
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  similarityThreshold: number;
}

export interface DataSourceConfig {
  name: string;
  entity: string;
  tableName: string;
  fields: string[];
  queryableFields: string[];
  relationFields?: string[];
  customDescription?: string;
}
