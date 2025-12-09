import { PartialType } from '@nestjs/swagger';
import { CreateAiChatDto } from './create-ai-chat.dto';

export class UpdateAiChatDto extends PartialType(CreateAiChatDto) {}
