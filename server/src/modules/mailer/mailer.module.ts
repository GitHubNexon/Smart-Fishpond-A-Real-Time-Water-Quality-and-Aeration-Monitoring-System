import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { User } from '../users/entities/user.entity';
import { Mailer } from './entities/mailer.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [MailerController],
  providers: [MailerService],
  imports: [TypeOrmModule.forFeature([Mailer, User]), SharedModule, AuthModule],
  exports: [MailerService],
})
export class MailerModule {}
