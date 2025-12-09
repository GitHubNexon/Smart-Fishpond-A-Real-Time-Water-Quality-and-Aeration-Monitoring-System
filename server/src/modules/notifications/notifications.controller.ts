import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';

@UseGuards(JwtAuthGuard, SessionGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('get-all-notif-list')
  @HttpCode(HttpStatus.OK)
  async getAllNotificationList() {
    return this.notificationsService.getAllNotificationList();
  }
}
