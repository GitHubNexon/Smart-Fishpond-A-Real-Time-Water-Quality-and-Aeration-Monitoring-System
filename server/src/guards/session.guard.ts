// src/guards/session.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Request } from 'express';
import { User } from 'src/modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

// Extend Express Request with optional user property
interface AuthenticatedRequest extends Request {
  cookies: { [key: string]: string };
  user?: User;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sessionId = request.cookies['sessionId'];

    if (!sessionId) {
      throw new UnauthorizedException('No active session found');
    }

    try {
      const user = await this.authService.validateSession(sessionId);
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        err.message || 'Session invalid or expired',
      );
    }
  }
}
