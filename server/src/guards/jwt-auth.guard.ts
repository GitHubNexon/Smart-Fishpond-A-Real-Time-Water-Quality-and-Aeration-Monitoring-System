/*
 * Requires a valid access token stored in memory on the client side.
 * The access token is short-lived (10 minutes) and must be sent
 * in the Authorization header as a Bearer token.
 * On page reload or token expiration, the client automatically calls
 * the refresh endpoint to obtain a new access token before retrying requests.
 */
// src/guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly isProd: boolean;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.isProd = this.configService.get<string>('NODE_ENV') === 'production';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.isProd) {
      return true;
    }
    const request = this.getRequest(context);

    // Extract token ONLY from Authorization header
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Authorization header with Bearer token required',
      );
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('ACCESS_SECRET'),
      });

      // Attach user info to request
      (request as any).user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Access token expired or invalid');
    }
  }

  private getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    return ctx.getRequest<Request>();
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    return token || null;
  }
}
