// src/modules/sockets/notifications/notifications.socket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from '../socket.service';
import { UsersSocketService } from '../users/users.socket.service';

export interface NotificationPayload {
  title: string;
  description?: string;
  data?: any; // any JSON data
  [key: string]: any; // allow extra fields
}

@Injectable()
export class NotificationsSocketService {
  private readonly logger = new Logger(NotificationsSocketService.name);

  constructor(
    private readonly socketService: SocketService,
    private readonly usersSocketService: UsersSocketService,
  ) {}

  /** Broadcast to all connected users */
  broadcastGlobal(notification: NotificationPayload) {
    this.logger.log(`Broadcasting global notification: ${notification.title}`);
    this.socketService.broadcast('notifications:global', notification);
  }

  /** Send notification to a specific user by userId */
  sendToUser(userId: string, notification: NotificationPayload) {
    const user = this.usersSocketService['onlineUsers'].get(userId);
    if (!user) {
      this.logger.warn(`User ${userId} not online`);
      return;
    }

    user.socketIds.forEach((socketId) => {
      this.socketService.sendToClient(
        socketId,
        'notifications:personal',
        notification,
      );
    });
  }
}

//server side
// // Broadcast to all users
// this.notificationsService.broadcastGlobal({
//   title: 'Server Update',
//   description: 'The system will undergo maintenance at 10 PM.',
//   data: { scheduledAt: '2025-10-11T22:00:00Z' },
//   severity: 'info', // extra custom field
// });

// // Send to a specific user
// this.notificationsService.sendToUser('userId123', {
//   title: 'Personal Alert',
//   description: 'You have a new message!',
//   data: { messageId: 'abc123' },
//   category: 'messages',
// });


//client side
// socket.on('notifications:global', (notif) => {
//   console.log(notif.title, notif.description, notif.data, notif.severity);
// });

// socket.on('notifications:personal', (notif) => {
//   console.log(notif.title, notif.description, notif.data, notif.category);
// });
