import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiChatService } from './services/ai-chat.service';
import { AIMSRagService } from './services/aims-rag.service';
import { RAGService } from './services/rag.service';
import { ChatBotHelper } from './helpers/chat-bot.helper';
import { EmbeddingService } from './services/embedding.service';

import { AiChatController } from './controllers/ai-chat.controller';
//modules or shared services
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { SocketModule } from 'src/modules/sockets/socket.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from 'src/modules/auth/auth.module';

// entities
import {
  ChatSession,
  ChatEmbedding,
  ChatMessage,
} from './entities/ai-chat.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ChatSession, ChatEmbedding, ChatMessage]),
    ConfigModule,
    SharedModule,
    SocketModule,
    NotificationsModule,
    AuditModule,
    AuthModule,
  ],
  controllers: [AiChatController],
  providers: [
    AiChatService,
    AIMSRagService,
    RAGService,
    ChatBotHelper,
    EmbeddingService,
  ],
  exports: [
    AiChatService,
    AIMSRagService,
    RAGService,
    ChatBotHelper,
    EmbeddingService,
  ],
})
export class AiChatModule {}
