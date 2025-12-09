//src/utils/config.module.ts

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // available everywhere
      envFilePath: '.env',
    }),
  ],
})
export class AppConfigModule {}