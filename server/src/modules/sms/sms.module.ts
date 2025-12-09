import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
