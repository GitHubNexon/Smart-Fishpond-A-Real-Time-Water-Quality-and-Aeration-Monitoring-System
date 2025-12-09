import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CreateSmDto } from './dto/create-sm.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  async sendSms(@Body() dto: CreateSmDto) {
    return this.smsService.sendSms(dto.to, dto.text);
  }
}
