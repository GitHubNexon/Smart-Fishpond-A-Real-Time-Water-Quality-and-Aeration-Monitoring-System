import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthLog } from './entities/auth-log.entity';
import { Session } from './entities/session.entity';
import { SharedModule } from 'src/shared.module';
import { AuthLogCleanupService } from 'src/modules/auth/auth-log-cleanup.service';
import { SocketModule } from 'src/modules/sockets/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AuthLog, Session]),
    SharedModule,
    SocketModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthLogCleanupService],
  exports: [AuthService],
})
export class AuthModule {}
