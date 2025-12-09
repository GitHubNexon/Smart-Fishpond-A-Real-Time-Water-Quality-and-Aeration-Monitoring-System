// dto/chat.dto.ts
import {
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsIn,
  IsJSON,
  IsArray,
} from 'class-validator';

/* ======================
   Chat Session DTOs
====================== */
export class CreateChatSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsUUID()
  senderId?: string; // UUID of the user starting the session
}

export class ChatSessionResponseDto {
  id: string;
  title?: string;
  senderId?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: ChatMessageResponseDto[];
}

/* ======================
   Chat Message DTOs
====================== */
export class CreateChatMessageDto {
  @IsUUID()
  sessionId: string;

  @IsIn(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;

  @IsOptional()
  @IsJSON()
  metadata?: Record<string, any>;
}

export class ChatMessageResponseDto {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  embeddings?: ChatEmbeddingResponseDto[];
}

/* ======================
   Chat Embedding DTOs
====================== */
export class CreateChatEmbeddingDto {
  @IsUUID()
  messageId: string;

  @IsString()
  content: string;

  @IsArray()
  embedding: number[];

  @IsOptional()
  @IsString()
  sourceTable?: string;

  @IsOptional()
  sourceId?: number;
}

export class ChatEmbeddingResponseDto {
  id: string;
  messageId: string;
  content: string;
  embedding: number[];
  sourceTable?: string;
  sourceId?: number;
  createdAt: Date;
  updatedAt: Date;
}
