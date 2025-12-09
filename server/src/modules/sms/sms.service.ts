import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  private readonly apiUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly deviceId?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Using non-null assertion to tell TS these are strings
    this.apiUrl = this.configService.get<string>('SMS_GATEWAY_API_URL')!;
    this.username = this.configService.get<string>('SMS_GATEWAY_USERNAME')!;
    this.password = this.configService.get<string>('SMS_GATEWAY_PASSWORD')!;
    this.deviceId = this.configService.get<string>('SMS_GATEWAY_DEVICE_ID'); // optional
  }

  async sendSms(to: string, text: string) {
    const body: any = {
      textMessage: { text },
      phoneNumbers: [to],
    };

    if (this.deviceId) {
      body.deviceId = this.deviceId;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/messages`, body, {
          auth: {
            username: this.username,
            password: this.password,
          },
        }),
      );

      return response.data;
    } catch (err) {
      console.error('Failed to send SMS:', err.response?.data || err.message);
      throw new Error('SMS sending failed');
    }
  }
}
