import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from '../users/entities/user.entity';

export type NotificationActions = 'DONE' | 'CANCEL' | 'READ';
export type NotificationStatus = 'PRIORITY' | 'ALERT' | 'NORMAL' | 'SUCCESS';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationRepository: Repository<Notifications>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Log an notification
   * @param params.id - Unique notification ID (primary key)
   * @param params.title - Title for Notification
   * @param params.description - description for notifications
   * @param params.action - Action type: 'DONE' | 'CANCEL' | 'READ' (default = 'READ')
   * @param params.status - notifications statut ('PRIORITY' | 'ALERT' | 'NORMAL' | 'SUCCESS')
   * @param params.timestamp - timestamp
   * @param params.url - url parameter for the notification
   */

  async notificationLogs({
    title,
    description,
    actions,
    status,
    url,
    author,
  }: {
    title: string;
    description: string;
    actions: NotificationActions;
    status: NotificationStatus;
    url?: string;
    author?: User;
  }) {
    const notif = this.notificationRepository.create({
      title,
      description,
      actions,
      status,
      url,
      author,
    });

    return this.notificationRepository.save(notif);
  }

  async getAllNotificationList(): Promise<{
    message: string;
    data: Notifications[];
  }> {
    const notifs = await this.notificationRepository.find({
      order: {
        timestamp: 'DESC',
      },
    });
    return {
      message: 'Success getting all Notificaitions',
      data: notifs,
    };
  }
}
