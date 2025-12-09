// src/utils/services/hashing/hashing.module.ts
import { Module, Global } from "@nestjs/common";
import { HashingService } from "../services/hashing.service";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
