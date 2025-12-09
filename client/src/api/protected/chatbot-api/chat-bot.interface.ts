// src/api/protected/chatbot-api/chat-bot.interface.ts

export interface SessionPayload {
  title?: string;
}

export interface ChatPayload {
  sessionId: string;
  message: string;
}

export interface MessageResponse {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    modelUsed?: string;
    timestamp?: string;
    performance?: {
      responseTimeMs?: number;
      tokensUsed?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface SessionResponse {
  id: string;
  title?: string;
  senderId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: MessageResponse[];
}

// Streaming response types
export type StreamChunk =
  | { type: 'chunk'; content: string; messageId: string }
  | { type: 'title'; title: string }
  | { type: 'done'; message: MessageResponse }
  | { type: 'error'; error: string };
