import { Test, TestingModule } from '@nestjs/testing';
import { AiChatService } from './services/ai-chat.service';

describe('AiChatService', () => {
  let service: AiChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiChatService],
    }).compile();

    service = module.get<AiChatService>(AiChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
