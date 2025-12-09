// src/api/protected/chatbot-api/chat-bot.api.ts
'use client';

import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import {
  SessionPayload,
  ChatPayload,
  SessionResponse,
  MessageResponse,
  StreamChunk,
} from './chat-bot.interface';

/**  Create a new chat session */
export async function createSession(
  createSession: SessionPayload,
): Promise<SessionResponse> {
  return handleRequest(axios.post('/ai-chat/sessions', createSession));
}

/** Send a message to the chatbot (non-streaming) */
export async function sendMessage(
  sendMessage: ChatPayload,
): Promise<MessageResponse> {
  return handleRequest(axios.post('/ai-chat/chatbot', sendMessage));
}

/** Get all sessions for the authenticated user */
export async function getUserSessions(): Promise<SessionResponse[]> {
  return handleRequest(axios.get('/ai-chat/sessions'));
}

/** Get a specific session with its messages */
export async function getSession(sessionId: string): Promise<SessionResponse> {
  return handleRequest(axios.get(`/ai-chat/sessions/${sessionId}`));
}

/** Delete a chat session */
export async function deleteSession(sessionId: string): Promise<any> {
  return handleRequest(axios.delete(`/ai-chat/sessions/${sessionId}`));
}
