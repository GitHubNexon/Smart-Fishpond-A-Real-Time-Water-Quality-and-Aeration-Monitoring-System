import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { SharedModule } from 'src/shared.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from 'src/modules/users/entities/user.entity';
import { AuditModule } from 'src/modules/audit/audit.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { SocketModule } from 'src/modules/sockets/socket.module';
import { Supplier, CompanyProfile } from './entities/system.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, CompanyProfile, User]),
    SharedModule,
    AuthModule,
    AuditModule,
    NotificationsModule,
    SocketModule,
  ],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
