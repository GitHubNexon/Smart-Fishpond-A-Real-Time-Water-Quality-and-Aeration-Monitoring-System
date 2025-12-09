// src/modules/ai-chat/controllers/ai-chat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AiChatService } from '../services/ai-chat.service';
import {
  CreateChatSessionDto,
  ChatSessionResponseDto,
  ChatMessageResponseDto,
} from '../dto/chat.dto';
import { ChatBotConfig } from '../helpers/chat-bot.helper';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/modules/users/entities/user.entity';

@UseGuards(SessionGuard, JwtAuthGuard)
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  /**
   * POST /api/ai-chat/sessions
   * Create a new chat session
   */
  @Post('sessions')
  async createSession(
    @Body() dto: CreateChatSessionDto,
    @Req() req?: any,
  ): Promise<ChatSessionResponseDto> {
    const userId = req?.user?.id;
    return this.aiChatService.createSession(dto, userId);
  }

  /**
   * GET /api/ai-chat/sessions
   * Get all sessions for the authenticated user
   */
  @Get('sessions')
  async getUserSessions(
    @GetUser() currentUser: User,
  ): Promise<ChatSessionResponseDto[]> {
    const userId = currentUser.id;
    return this.aiChatService.getUserSessions(userId);
  }

  /**
   * GET /api/ai-chat/sessions/:sessionId
   * Get a specific session with its messages
   */
  @Get('sessions/:sessionId')
  async getSession(
    @Param('sessionId') sessionId: string,
    @GetUser() currentUser: User,
  ): Promise<ChatSessionResponseDto> {
    return this.aiChatService.getSession(sessionId, currentUser);
  }

  /**
   * DELETE /api/ai-chat/sessions/:sessionId
   * Delete a chat session
   */
  @Delete('sessions/:sessionId')
  async deleteSession(@Param('sessionId') sessionId: string): Promise<void> {
    return this.aiChatService.deleteSession(sessionId);
  }


  /**
   * POST /api/ai-chat/chatbot
   * Send a message to the chatbot (non-streaming, backward compatible)
   */
  @Post('chatbot')
  async sendMessage(
    @Body('sessionId') sessionId: string,
    @Body('message') message: string,
    @Req() req?: any,
  ): Promise<ChatMessageResponseDto> {
    if (!sessionId || !message) {
      throw new Error('sessionId and message are required');
    }

    const userId = req?.user?.id;
    return this.aiChatService.sendMessage(sessionId, message, userId);
  }

  /**
   * GET /api/ai-chat/config
   * Get current chatbot configuration
   */
  @Get('config')
  async getConfig(): Promise<ChatBotConfig> {
    return this.aiChatService.getChatBotConfig();
  }

  /**
   * PATCH /api/ai-chat/config
   * Update chatbot configuration
   */
  @Patch('config')
  async updateConfig(
    @Body() config: Partial<ChatBotConfig>,
  ): Promise<ChatBotConfig> {
    this.aiChatService.updateChatBotConfig(config);
    return this.aiChatService.getChatBotConfig();
  }
}
