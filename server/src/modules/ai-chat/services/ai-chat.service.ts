import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { v7 as uuidv7 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ChatBotHelper, ChatBotConfig } from '../helpers/chat-bot.helper';
import {
  ChatSession,
  ChatEmbedding,
  ChatMessage,
} from '../entities/ai-chat.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateChatSessionDto,
  CreateChatEmbeddingDto,
  ChatSessionResponseDto,
  ChatMessageResponseDto,
} from '../dto/chat.dto';
import { AIMSRagService } from '../services/aims-rag.service';

@Injectable()
export class AiChatService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatEmbedding)
    private readonly chatEmbeddingRepository: Repository<ChatEmbedding>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    private readonly configService: ConfigService,
    private readonly aimsRagService: AIMSRagService,
    private readonly chatBotHelper: ChatBotHelper,
  ) {}

  /**
   * Create a new chat session
   */
  async createSession(
    dto: CreateChatSessionDto,
    currentUser: User,
  ): Promise<ChatSessionResponseDto> {
    // COUNT how many sessions the user already has
    const sessionCount = await this.chatSessionRepository.count({
      where: { sender: { id: currentUser.id } },
    });

    // ENFORCE LIMIT = 5
    if (sessionCount >= 5) {
      throw new BadRequestException(
        'You can only create up to 5 chat sessions.',
      );
    }

    const session = this.chatSessionRepository.create({
      title: dto.title || 'New Chat',
      sender: currentUser ? ({ id: currentUser } as any) : null,
    });

    const saved = await this.chatSessionRepository.save(session);

    return {
      id: saved.id,
      title: saved.title,
      senderId: saved.sender?.id,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<ChatSessionResponseDto[]> {
    const sessions = await this.chatSessionRepository.find({
      where: { sender: { id: userId } },
      order: { updatedAt: 'DESC' },
    });

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      senderId: s.sender?.id,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  /**
   * Get a session with its messages
   */
  async getSession(
    sessionId: string,
    currentUser: User,
  ): Promise<ChatSessionResponseDto> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, sender: { id: currentUser.id } },
      relations: ['messages'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    return {
      id: session.id,
      title: session.title,
      senderId: session.sender?.id,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messages: session.messages
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((m) => ({
          id: m.id,
          sessionId: m.session_id.toString(),
          role: m.role,
          content: m.content,
          metadata: m.metadata,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        })),
    };
  }

  /**
   * send a message (NO RAG)
  async sendMessage(
    sessionId: string,
    content: string,
    currentUser: User,
  ): Promise<ChatMessageResponseDto> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, sender: { id: currentUser.id } },
      relations: ['messages'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    // Save user message
    const userMessage = this.chatMessageRepository.create({
      session: session,
      session_id: session.id as any,
      role: 'user',
      content: content,
      metadata: { timestamp: new Date(), userId: currentUser.id },
    });
    await this.chatMessageRepository.save(userMessage);

    // Update session title if this is the first user message
    const messageCount = await this.chatMessageRepository.count({
      where: { session_id: session.id as any, role: 'user' },
    });

    if (messageCount === 1) {
      try {
        const title = await this.chatBotHelper.generateSessionTitle(content);
        await this.chatSessionRepository.update(
          { id: sessionId },
          { title, updatedAt: new Date() as any },
        );
      } catch (error) {
        console.error('Failed to generate title:', error);
      }
    }

    // Get conversation history
    const messages = await this.chatMessageRepository.find({
      where: { session_id: session.id as any },
      order: { createdAt: 'ASC' },
    });

    const conversationHistory = messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    // Get AI response
    const aiResponse = await this.chatBotHelper.chat(conversationHistory);

    // Save assistant message
    const assistantMessage = this.chatMessageRepository.create({
      session: session,
      session_id: session.id as any,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        ...aiResponse.metadata,
        modelUsed: aiResponse.metadata.modelUsed,
      },
    });

    const savedAssistantMessage =
      await this.chatMessageRepository.save(assistantMessage);

    // Generate embedding asynchronously
    this.generateEmbeddingAsync(savedAssistantMessage.id, aiResponse.content);

    // Update session timestamp
    await this.chatSessionRepository.update(
      { id: sessionId },
      { updatedAt: new Date() as any },
    );

    return {
      id: savedAssistantMessage.id,
      sessionId: savedAssistantMessage.session_id.toString(),
      role: savedAssistantMessage.role,
      content: savedAssistantMessage.content,
      metadata: savedAssistantMessage.metadata,
      createdAt: savedAssistantMessage.createdAt,
      updatedAt: savedAssistantMessage.updatedAt,
    };
  }
   */

  /**
   * Send a message with RAG (Retrieval-Augmented Generation)
   */
  async sendMessage(
    sessionId: string,
    content: string,
    currentUser: User,
  ): Promise<ChatMessageResponseDto> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId, sender: { id: currentUser.id } },
      relations: ['messages'],
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    // Save user message
    const userMessage = this.chatMessageRepository.create({
      session: session,
      session_id: session.id as any,
      role: 'user',
      content: content,
      metadata: { timestamp: new Date(), userId: currentUser.id },
    });
    await this.chatMessageRepository.save(userMessage);

    // Update session title if this is the first user message
    const messageCount = await this.chatMessageRepository.count({
      where: { session_id: session.id as any, role: 'user' },
    });

    if (messageCount === 1) {
      try {
        const title = await this.chatBotHelper.generateSessionTitle(content);
        await this.chatSessionRepository.update(
          { id: sessionId },
          { title, updatedAt: new Date() as any },
        );
      } catch (error) {
        console.error('Failed to generate title:', error);
      }
    }

    // RAG ENHANCEMENT: Query database for relevant context
    let dbContext = '';
    try {
      dbContext = await this.aimsRagService.queryAIMS(content);
      if (
        !dbContext ||
        dbContext.trim() === '' ||
        dbContext === 'No data found in the database.'
      ) {
        console.warn(' WARNING: RAG returned empty or no-data context');
      }
    } catch (error) {
      console.error('RAG query failed:', error.message);
      console.error('Stack:', error.stack);
      dbContext = 'Error retrieving database context.';
    }

    // Get conversation history
    const messages = await this.chatMessageRepository.find({
      where: { session_id: session.id as any },
      order: { createdAt: 'ASC' },
    });

    // Build conversation with RAG context
    const conversationHistory = [
      {
        role: 'system' as const,
        content: `${this.chatBotHelper.getConfig().systemPrompt}

IMPORTANT: Use ONLY the following database context to answer questions about assets, inventory, transactions, and depreciation. Do not make up data.

DATABASE CONTEXT:
${dbContext}

Rules:
1. If the context contains the answer, provide it clearly and concisely
2. If the context doesn't contain the information, say "I don't have that information in the database"
3. Always cite the data source when providing statistics (e.g., "According to the assets table...")
4. Be specific with numbers and status information
5. For count queries, provide exact numbers from the database`,
      },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    // Get AI response with context
    const aiResponse = await this.chatBotHelper.chat(conversationHistory);

    // Save assistant message with metadata about sources
    const assistantMessage = this.chatMessageRepository.create({
      session: session,
      session_id: session.id as any,
      role: 'assistant',
      content: aiResponse.content,
      metadata: {
        ...aiResponse.metadata,
        ragContext: dbContext,
        contextUsed: true,
        timestamp: new Date(),
      },
    });

    const savedAssistantMessage =
      await this.chatMessageRepository.save(assistantMessage);

    // Generate embedding asynchronously (don't block response not working properly)
    this.generateEmbeddingAsync(savedAssistantMessage.id, aiResponse.content);

    // Update session timestamp
    await this.chatSessionRepository.update(
      { id: sessionId },
      { updatedAt: new Date() as any },
    );

    return {
      id: savedAssistantMessage.id,
      sessionId: savedAssistantMessage.session_id.toString(),
      role: savedAssistantMessage.role,
      content: savedAssistantMessage.content,
      metadata: savedAssistantMessage.metadata,
      createdAt: savedAssistantMessage.createdAt,
      updatedAt: savedAssistantMessage.updatedAt,
    };
  }

  /**
   * Generate embedding asynchronously (don't block response)
   */
  private async generateEmbeddingAsync(
    messageId: string,
    content: string,
  ): Promise<void> {
    try {
      const embedding = await this.chatBotHelper.generateEmbedding(content);
      const saved = await this.createEmbedding({
        messageId,
        content,
        embedding,
      });
    } catch (error) {
      // Don't throw - let it fail silently for async operation
    }
  }

  /**
   * Create embedding for a message
   */
  async createEmbedding(dto: CreateChatEmbeddingDto): Promise<ChatEmbedding> {
    const embedding = this.chatEmbeddingRepository.create({
      message: { id: dto.messageId } as any,
      message_id: dto.messageId as any,
      content: dto.content,
      embedding: dto.embedding,
      source_table: dto.sourceTable,
      source_id: dto.sourceId,
    });

    return await this.chatEmbeddingRepository.save(embedding);
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const result = await this.chatSessionRepository.delete({ id: sessionId });

    if (result.affected === 0) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
  }

  /**
   * Update chatbot configuration
   */
  updateChatBotConfig(config: Partial<ChatBotConfig>): void {
    this.chatBotHelper.updateConfig(config);
  }

  /**
   * Get current chatbot configuration
   */
  getChatBotConfig(): ChatBotConfig {
    return this.chatBotHelper.getConfig();
  }
}
