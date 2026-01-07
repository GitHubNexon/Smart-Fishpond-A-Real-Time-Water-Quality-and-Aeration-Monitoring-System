import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ESP32EndpointService } from '../services/esp32-endpoint.service';

@Controller('esp-32')
export class Esp32Controller {
  constructor(private readonly esp32Service: ESP32EndpointService) {}

  /**
   * Connect ESP32 device
   * POST /esp-32/connect
   */
  @Post('connect')
  async connect(@Body() body: { socketId: string }) {
    return this.esp32Service.connectESP32(body.socketId);
  }

  /**
   * Disconnect ESP32 device
   * POST /esp-32/disconnect
   */
  @Post('disconnect')
  async disconnect(@Body() body: { socketId: string }) {
    return this.esp32Service.disconnectESP32(body.socketId);
  }

  /**
   * Get all connected ESP32 devices or specific device info
   * GET /esp-32/info
   * GET /esp-32/info?socketId=xxx
   */
  @Get('info')
  async getInfo(@Query('socketId') socketId?: string) {
    return this.esp32Service.getESP32Info(socketId);
  }

  /**
   * Get specific ESP32 device info by ID
   * GET /esp-32/info/:socketId
   */
  @Get('info/:socketId')
  async getInfoById(@Param('socketId') socketId: string) {
    return this.esp32Service.getESP32Info(socketId);
  }

  /**
   * Test handshake with ESP32
   * POST /esp-32/handshake
   */
  @Post('handshake')
  async testHandshake(
    @Body() body: { socketId: string; data?: any },
  ) {
    return this.esp32Service.testHandshakeESP32(body.socketId, body.data);
  }
}