# Replicate.com Chatbot Integration Guide

## Installation

First, install the required dependencies:

```bash
npm install replicate
# or
yarn add replicate
```

## Environment Variables

Add these to your `.env` file:

```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx
MODEL=meta/meta-llama-3-8b-instruct
```

## File Structure

```
src/modules/ai-chat/
├── controllers/
│   └── ai-chat.controller.ts
├── services/
│   └── ai-chat.service.ts
├── entities/
│   └── ai-chat.entity.ts
├── dto/
│   └── chat.dto.ts
└── helpers/
    └── chat-bot.helper.ts
```

## Module Setup

Update your `ai-chat.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AiChatController } from './controllers/ai-chat.controller';
import { AiChatService } from './services/ai-chat.service';
import {
  ChatSession,
  ChatMessage,
  ChatEmbedding,
} from './entities/ai-chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSession, ChatMessage, ChatEmbedding]),
    ConfigModule,
  ],
  controllers: [AiChatController],
  providers: [AiChatService],
  exports: [AiChatService],
})
export class AiChatModule {}
```

## API Endpoints

### 1. Create a Chat Session

```http
POST /api/ai-chat/sessions
Content-Type: application/json

{
  "title": "My Chat Session",
  "senderId": "user-uuid-here" // optional
}
```

**Response:**
```json
{
  "id": "session-uuid",
  "title": "My Chat Session",
  "senderId": "user-uuid",
  "createdAt": "2025-11-12T10:00:00Z",
  "updatedAt": "2025-11-12T10:00:00Z"
}
```

### 2. Send a Message to Chatbot

```http
POST /api/ai-chat/chatbot
Content-Type: application/json

{
  "sessionId": "session-uuid",
  "message": "What is the capital of France?"
}
```

**Response:**
```json
{
  "id": "message-uuid",
  "sessionId": "session-uuid",
  "role": "assistant",
  "content": "Paris is the capital of France.",
  "metadata": {
    "modelUsed": "meta/meta-llama-3-8b-instruct",
    "timestamp": "2025-11-12T10:01:00Z",
    "performance": {
      "responseTimeMs": 1234,
      "tokensUsed": 15
    }
  },
  "createdAt": "2025-11-12T10:01:00Z",
  "updatedAt": "2025-11-12T10:01:00Z"
}
```

### 3. Get Session with Messages

```http
GET /api/ai-chat/sessions/:sessionId
```

### 4. Get All User Sessions

```http
GET /api/ai-chat/sessions
```

### 5. Delete Session

```http
DELETE /api/ai-chat/sessions/:sessionId
```

### 6. Get Chatbot Configuration

```http
GET /api/ai-chat/config
```

**Response:**
```json
{
  "systemPrompt": "This is the chatbot's standard response...",
  "maxTokens": 512,
  "minTokens": 0,
  "temperature": 0.7,
  "topP": 0.9,
  "topK": 50,
  "stopSequences": ["</s>", "<|eot_id|>"],
  "lengthPenalty": 1.0,
  "presencePenalty": 0.0,
  "promptTemplate": "...",
  "maxNewTokens": 512,
  "minNewTokens": 0,
  "logPerformanceMetrics": true
}
```

### 7. Update Chatbot Configuration

```http
PATCH /api/ai-chat/config
Content-Type: application/json

{
  "temperature": 0.8,
  "maxTokens": 1024,
  "systemPrompt": "You are a helpful assistant."
}
```

## Hard-coded Configuration Locations

All chatbot configuration is centralized in:

**`src/modules/ai-chat/helpers/chat-bot.helper.ts`**

```typescript
export const DEFAULT_CHATBOT_CONFIG: ChatBotConfig = {
  systemPrompt: "This is the chatbot's standard response. Always provide brief, direct answers without extra explanation or conclusions.",
  maxTokens: 512,              // ← HERE
  minTokens: 0,                // ← HERE
  temperature: 0.7,            // ← HERE
  topP: 0.9,                   // ← HERE
  topK: 50,                    // ← HERE
  stopSequences: ['</s>', '<|eot_id|>'],  // ← HERE
  lengthPenalty: 1.0,          // ← HERE
  presencePenalty: 0.0,        // ← HERE
  seed: undefined,             // ← HERE
  promptTemplate: '...',       // ← HERE
  maxNewTokens: 512,           // ← HERE
  minNewTokens: 0,             // ← HERE
  logPerformanceMetrics: true, // ← HERE
};
```

## Usage Example (Frontend)

```typescript
// 1. Create a session
const session = await fetch('/api/ai-chat/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'My Chat' }),
}).then(r => r.json());

// 2. Send a message
const response = await fetch('/api/ai-chat/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: session.id,
    message: 'Hello, how are you?',
  }),
}).then(r => r.json());

console.log(response.content); // AI response
```

## Database Migrations

Make sure to run migrations to create the tables:

```bash
npm run migration:run
# or
yarn migration:run
```

## Features

✅ Chat session management  
✅ Conversation history tracking  
✅ Configurable AI parameters  
✅ Automatic embedding generation  
✅ Performance metrics logging  
✅ Support for system prompts  
✅ Streaming support (Replicate)  

## Notes

- The chatbot maintains conversation context within a session
- Embeddings are generated automatically for AI responses
- All configuration can be updated at runtime via API
- Performance metrics are logged when enabled
- Sessions cascade delete (all messages deleted with session)