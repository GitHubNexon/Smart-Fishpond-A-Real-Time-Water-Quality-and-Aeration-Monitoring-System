// src/modules/sockets/users/users.socket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from '../socket.service';
import { Socket } from 'socket.io';

interface OnlineUser {
  userId?: string;
  username?: string;
  socketIds: string[]; // track all sockets per user
  connectedAt: Date;
}

@Injectable()
export class UsersSocketService {
  private readonly logger = new Logger(UsersSocketService.name);

  // Key = userId (or socketId if no userId)
  private onlineUsers: Map<string, OnlineUser> = new Map();

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId || client.id;
    const username = client.handshake.auth.username;

    if (this.onlineUsers.has(userId)) {
      // Add socketId to existing user
      this.onlineUsers.get(userId)!.socketIds.push(client.id);
    } else {
      // New user
      this.onlineUsers.set(userId, {
        userId,
        username,
        socketIds: [client.id],
        connectedAt: new Date(),
      });
    }

    this.logger.log(`User connected: ${username || client.id} `);
    this.broadcastOnlineUsers();
  }

  handleDisconnect(clientId: string) {
    for (const [userId, user] of this.onlineUsers.entries()) {
      const index = user.socketIds.indexOf(clientId);
      if (index > -1) {
        user.socketIds.splice(index, 1);
        if (user.socketIds.length === 0) {
          this.onlineUsers.delete(userId);
          this.logger.log(`User disconnected: ${user.username || userId}`);
        }
        break;
      }
    }

    this.broadcastOnlineUsers();
  }

  handleLogout(client: Socket) {
    this.logger.log(`User logout: ${client.id}`);
    this.handleDisconnect(client.id);
    client.disconnect(true);
  }

  getOnlineUsers() {
    return Array.from(this.onlineUsers.values()).map((u) => ({
      userId: u.userId,
      username: u.username,
      connectedAt: u.connectedAt,
    }));
  }

  broadcastOnlineUsers() {
    const users = this.getOnlineUsers();
    this.socketService.broadcast('users:online', users);
  }
}
