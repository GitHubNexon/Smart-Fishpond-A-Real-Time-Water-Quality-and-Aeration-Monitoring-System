import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLog } from './entities/audit-log.entity';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), SharedModule, AuthModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
