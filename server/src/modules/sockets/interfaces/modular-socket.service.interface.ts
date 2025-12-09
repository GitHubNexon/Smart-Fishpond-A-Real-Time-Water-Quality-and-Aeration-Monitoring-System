// src/modules/sockets/interfaces/modular-socket.service.interface.ts
import { Socket } from 'socket.io';

export interface ModularSocketService {
  handleConnection?(client: Socket): void;
  handleDisconnect?(clientId: string): void;
}
