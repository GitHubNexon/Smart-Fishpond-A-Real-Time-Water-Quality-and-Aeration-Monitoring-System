import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { Notifications } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    TypeOrmModule.forFeature([Notifications, User]),
    SharedModule,
    AuthModule,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
