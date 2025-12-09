import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Mailer } from './entities/mailer.entity';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { UpdateMailerDto } from './dto/update-mailer.dto';

export type EmailPriority = 'HIGH' | 'NORMAL' | 'LOW';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Mailer)
    private readonly mailerRepository: Repository<Mailer>,
    private readonly configService: ConfigService,
  ) {
    // Initialize nodemailer transporter for Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  /**
   * Send an email and log it to the database
   * @param params.recipient - Email recipient address
   * @param params.subject - Email subject
   * @param params.body - HTML body of the email
   * @param params.sender - Optional sender email (defaults to EMAIL_USER from .env)
   * @param params.priority - Optional email priority ('HIGH' | 'NORMAL' | 'LOW')
   * @returns Promise with email log entry
   */
  async sendEmail({
    recipient,
    subject,
    body,
    sender,
    priority = 'NORMAL',
  }: {
    recipient: string;
    subject: string;
    body: string;
    sender?: string;
    priority?: EmailPriority;
  }): Promise<Mailer> {
    const fromEmail = sender || this.configService.get<string>('EMAIL_USER');

    // Create email log entry
    const emailLog = this.mailerRepository.create({
      sender: fromEmail,
      recepient: recipient,
      subject,
      body,
    });

    try {
      // Send email using nodemailer
      const info = await this.transporter.sendMail({
        from: fromEmail,
        to: recipient,
        subject,
        html: body,
        priority: priority.toLowerCase(),
      });

      console.log('Email sent successfully:', info.messageId);

      // Save successful email log
      return await this.mailerRepository.save(emailLog);
    } catch (error) {
      // Log error in database
      emailLog.error_message = error.message || 'Unknown error occurred';
      await this.mailerRepository.save(emailLog);

      throw new InternalServerErrorException(
        `Failed to send email: ${error.message}`,
      );
    }
  }

  /**
   * Send a welcome email to new users
   */
  async sendWelcomeEmail(recipient: string, userName: string): Promise<Mailer> {
    const subject = 'Welcome to Our Platform!';
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, ${userName}!</h1>
        <p style="color: #666; line-height: 1.6;">
          Thank you for joining our platform. We're excited to have you on board!
        </p>
        <p style="color: #666; line-height: 1.6;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({ recipient, subject, body });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    recipient: string,
    resetToken: string,
    userName: string,
  ): Promise<Mailer> {
    const resetUrl = `/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p style="color: #666; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="color: #666; line-height: 1.6;">
          You requested to reset your password. Click the button below to reset it:
        </p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; margin: 20px 0; 
                  background-color: #007bff; color: #ffffff; text-decoration: none; 
                  border-radius: 4px;">
          Reset Password
        </a>
        <p style="color: #666; line-height: 1.6;">
          If you didn't request this, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px;">
          This link will expire in 1 hour.
        </p>
      </div>
    `;

    return this.sendEmail({ recipient, subject, body, priority: 'HIGH' });
  }

  /**
   * Send a notification email
   */
  async sendNotificationEmail(
    recipient: string,
    notificationTitle: string,
    notificationBody: string,
  ): Promise<Mailer> {
    const subject = `Notification: ${notificationTitle}`;
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${notificationTitle}</h2>
        <p style="color: #666; line-height: 1.6;">
          ${notificationBody}
        </p>
      </div>
    `;

    return this.sendEmail({ recipient, subject, body });
  }

  /**
   * Get all email logs
   */
  async getAllEmailLogs(): Promise<{
    message: string;
    data: Mailer[];
  }> {
    const emails = await this.mailerRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Success getting all email logs',
      data: emails,
    };
  }

  /**
   * Get email logs by recipient
   */
  async getEmailLogsByRecipient(recipient: string): Promise<{
    message: string;
    data: Mailer[];
  }> {
    const emails = await this.mailerRepository.find({
      where: { recepient: recipient },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: `Success getting email logs for ${recipient}`,
      data: emails,
    };
  }

  /**
   * Get failed email logs
   */
  async getFailedEmailLogs(): Promise<{
    message: string;
    data: Mailer[];
  }> {
    const emails = await this.mailerRepository
      .createQueryBuilder('email')
      .where('email.error_message IS NOT NULL')
      .orderBy('email.created_at', 'DESC')
      .getMany();

    return {
      message: 'Success getting failed email logs',
      data: emails,
    };
  }

  /**
   * Retry sending a failed email
   */
  async retryFailedEmail(emailId: string): Promise<Mailer> {
    const emailLog = await this.mailerRepository.findOne({
      where: { id: emailId },
    });

    if (!emailLog) {
      throw new NotFoundException(`Email log with ID ${emailId} not found`);
    }

    if (!emailLog.error_message) {
      throw new BadRequestException('This email was sent successfully');
    }

    return this.sendEmail({
      recipient: emailLog.recepient,
      subject: emailLog.subject,
      body: emailLog.body,
      sender: emailLog.sender,
    });
  }

  /**
   * Verify email transporter connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}
