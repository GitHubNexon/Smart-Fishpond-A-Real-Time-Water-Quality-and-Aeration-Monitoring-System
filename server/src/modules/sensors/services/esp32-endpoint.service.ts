import { Injectable, Logger } from '@nestjs/common';

interface ESP32Client {
  id: string;
  connected: boolean;
  connectedAt?: Date;
  lastSeen?: Date;
}

@Injectable()
export class ESP32EndpointService {
  private readonly logger = new Logger(ESP32EndpointService.name);
  private connectedDevices: Map<string, ESP32Client> = new Map();

  /**
   * Connect esp32
   * POST METHOD
   * this will be a post method that connects to esp32
   */
  async connectESP32(socketId: string) {
    try {
      const device: ESP32Client = {
        id: socketId,
        connected: true,
        connectedAt: new Date(),
        lastSeen: new Date(),
      };

      this.connectedDevices.set(socketId, device);
      this.logger.log(`ESP32 connected: ${socketId}`);

      return {
        success: true,
        message: 'ESP32 connected successfully',
        deviceId: socketId,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error connecting ESP32: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disconnect esp32
   * POST method
   * this is a simple disconnection of esp32 to web server
   */
  async disconnectESP32(socketId: string) {
    try {
      const device = this.connectedDevices.get(socketId);
      
      if (device) {
        this.connectedDevices.delete(socketId);
        this.logger.log(`ESP32 disconnected: ${socketId}`);

        return {
          success: true,
          message: 'ESP32 disconnected successfully',
          deviceId: socketId,
          timestamp: new Date(),
        };
      }

      return {
        success: false,
        message: 'ESP32 not found',
        deviceId: socketId,
      };
    } catch (error) {
      this.logger.error(`Error disconnecting ESP32: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Esp32 Info
   * Get Method
   * this is a read mode only that maybe an additional endpoint to verify if the esp32 is connected successfully
   */
  async getESP32Info(socketId?: string) {
    try {
      if (socketId) {
        const device = this.connectedDevices.get(socketId);
        
        if (!device) {
          return {
            success: false,
            message: 'ESP32 not found',
            connected: false,
          };
        }

        return {
          success: true,
          device: {
            id: device.id,
            connected: device.connected,
            connectedAt: device.connectedAt,
            lastSeen: device.lastSeen,
          },
        };
      }

      // Return all connected devices
      const devices = Array.from(this.connectedDevices.values());
      
      return {
        success: true,
        totalDevices: devices.length,
        devices: devices.map(d => ({
          id: d.id,
          connected: d.connected,
          connectedAt: d.connectedAt,
          lastSeen: d.lastSeen,
        })),
      };
    } catch (error) {
      this.logger.error(`Error getting ESP32 info: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test Handshake
   * POST method
   * this will be a test endpoint if a webserver can send data to esp32
   * and esp32 can send back.
   */
  async testHandshakeESP32(socketId: string, data?: any) {
    try {
      const device = this.connectedDevices.get(socketId);

      if (!device) {
        return {
          success: false,
          message: 'ESP32 not found or not connected',
        };
      }

      // Update last seen
      device.lastSeen = new Date();
      this.connectedDevices.set(socketId, device);

      return {
        success: true,
        message: 'Handshake successful',
        deviceId: socketId,
        receivedData: data,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error in handshake: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update last seen timestamp
   */
  updateLastSeen(socketId: string) {
    const device = this.connectedDevices.get(socketId);
    if (device) {
      device.lastSeen = new Date();
      this.connectedDevices.set(socketId, device);
    }
  }

  /**
   * Check if device is connected
   */
  isConnected(socketId: string): boolean {
    return this.connectedDevices.has(socketId);
  }
}