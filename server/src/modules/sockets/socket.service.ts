//src/modules/sockets/socket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);

  /**
   * A map of connected clients
   * Key = client ID (socket.id)
   * Value = socket instance
   */
  private clients: Map<string, Socket> = new Map();

  /**
   * Add a client to the list when they connect
   */
  addClient(client: Socket) {
    this.clients.set(client.id, client);
    this.logger.log(`Client added: ${client.id}`);
  }

  /**
   * Remove a client from the list when they disconnect
   */
  removeClient(clientId: string) {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
      this.logger.log(`Client removed: ${clientId}`);
    }
  }

  /**
   * Send a message to a specific client
   */
  sendToClient(clientId: string, event: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit(event, data);
    } else {
      this.logger.warn(`Attempted to send to non-existent client: ${clientId}`);
    }
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(event: string, data: any) {
    this.clients.forEach((client) => {
      client.emit(event, data);
    });
  }

  /**
   * Return all connected clients (for debugging)
   */
  getConnectedClients(): string[] {
    return Array.from(this.clients.keys());
  }
}
