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
import { MailerService } from './mailer.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send a custom email
   * POST /mailer/send
   */
  @Post('send')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async sendEmail(
    @Body()
    body: {
      recipient: string;
      subject: string;
      body: string;
      sender?: string;
      priority?: 'HIGH' | 'NORMAL' | 'LOW';
    },
  ) {
    try {
      const result = await this.mailerService.sendEmail(body);
      return {
        message: 'Email sent successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send welcome email
   * POST /mailer/welcome
   */
  @Post('welcome')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async sendWelcomeEmail(
    @Body() body: { recipient: string; userName: string },
  ) {
    try {
      const result = await this.mailerService.sendWelcomeEmail(
        body.recipient,
        body.userName,
      );
      return {
        message: 'Welcome email sent successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send welcome email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send password reset email
   * POST /mailer/password-reset
   */
  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  async sendPasswordResetEmail(
    @Body()
    body: {
      recipient: string;
      resetToken: string;
      userName: string;
    },
  ) {
    try {
      const result = await this.mailerService.sendPasswordResetEmail(
        body.recipient,
        body.resetToken,
        body.userName,
      );
      return {
        message: 'Password reset email sent successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send password reset email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send notification email
   * POST /mailer/notification
   */
  @Post('notification')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async sendNotificationEmail(
    @Body()
    body: {
      recipient: string;
      notificationTitle: string;
      notificationBody: string;
    },
  ) {
    try {
      const result = await this.mailerService.sendNotificationEmail(
        body.recipient,
        body.notificationTitle,
        body.notificationBody,
      );
      return {
        message: 'Notification email sent successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send notification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all email logs
   * GET /mailer/logs
   */
  @Get('logs')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async getAllEmailLogs() {
    return this.mailerService.getAllEmailLogs();
  }

  /**
   * Get email logs by recipient
   * GET /mailer/logs/recipient?email=user@example.com
   */
  @Get('logs/recipient')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async getEmailLogsByRecipient(@Query('email') email: string) {
    if (!email) {
      throw new HttpException(
        'Email query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.mailerService.getEmailLogsByRecipient(email);
  }

  /**
   * Get failed email logs
   * GET /mailer/logs/failed
   */
  @Get('logs/failed')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async getFailedEmailLogs() {
    return this.mailerService.getFailedEmailLogs();
  }

  /**
   * Retry sending a failed email
   * POST /mailer/retry/:id
   */
  @Post('retry/:id')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async retryFailedEmail(@Param('id') id: string) {
    try {
      const result = await this.mailerService.retryFailedEmail(id);
      return {
        message: 'Email retry successful',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retry email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify email connection
   * GET /mailer/verify
   */
  @Get('verify')
  @UseGuards(JwtAuthGuard, SessionGuard)
  @HttpCode(HttpStatus.OK)
  async verifyConnection() {
    const isConnected = await this.mailerService.verifyConnection();
    return {
      message: isConnected
        ? 'Email server connection verified'
        : 'Email server connection failed',
      connected: isConnected,
    };
  }
}
