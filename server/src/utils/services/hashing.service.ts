//src/utils/services/hashing/service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = Number(this.configService.get<number>('SALT_ROUNDS')) || 10;
  }

  /** Hash a plain text password */
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  /** Compare plain password with hashed password */
  async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }
}
