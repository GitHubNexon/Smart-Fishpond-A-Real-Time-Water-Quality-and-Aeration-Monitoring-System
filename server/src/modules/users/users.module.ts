import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Roles } from 'src/modules/rbac/entities/roles.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SharedModule } from 'src/shared.module';
import { UserSubscriber } from './subscribers/user.subscriber';
import { Employee } from '../employee/entities/employee.entity';
import { AuthLog } from 'src/modules/auth/entities/auth-log.entity';
import { UserPermissions } from 'src/modules/rbac/entities/user-permission.entity';
import { Notifications } from 'src/modules/notifications/entities/notification.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';
import { FileUploadService } from 'src/utils/services/file-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Roles,
      Employee,
      AuthLog,
      UserPermissions,
      Notifications,
      AuditLog,
    ]),
    SharedModule,
    NotificationsModule,
    AuditModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber, FileUploadService],
})
export class UsersModule {}
