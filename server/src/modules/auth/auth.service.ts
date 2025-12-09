import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { HashingService } from 'src/utils/services/hashing.service';
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';
import { LoginResponseDto, PayloadUser } from './dto/login-dto';
import { AuthLog } from './entities/auth-log.entity';
import { Session } from './entities/session.entity';
import { randomBytes } from 'crypto';
import { NotificationsSocketService } from 'src/modules/sockets/notifications/notifications.socket.service';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  /** Utility to clear all session-related cookies */
  private clearSessionCookies(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const sameSite = isProd ? 'none' : 'lax';

    res.clearCookie('sessionId', { httpOnly: true, secure: isProd, sameSite });
    res.clearCookie(process.env.TOKEN_NAME ?? '_auth_token_', {
      httpOnly: true,
      secure: isProd,
      sameSite,
    });
    res.clearCookie(process.env.PASSKEY_TOKEN_NAME ?? '_passkey_token_', {
      httpOnly: true,
      secure: isProd,
      sameSite,
    });
    res.clearCookie('XSRF-TOKEN', {
      httpOnly: false,
      secure: isProd,
      sameSite,
    });
  }

  /** Parse "10m", "30d" → ms */
  private parseExpiration(exp: string): number {
    const unit = exp.slice(-1);
    const value = parseInt(exp.slice(0, -1));
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid expiration format');
    }
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthLog)
    private readonly authLogRepository: Repository<AuthLog>,
    private readonly authLogPagination: PaginationService<AuthLog>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsSocketService,
  ) {}

  /** Authentication / Sign-In */
  async authenticate(
    email: string,
    password: string,
    res: Response,
  ): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) throw new NotFoundException('Account not found or deactivated.');

    // 1. Check lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new ForbiddenException(
        `Account locked. Try again later. ${user.lockoutUntil}, contact System Administrator for assistance.`,
      );
    }

    // 2. Verify password
    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
        user.lockoutUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
        await this.userRepository.save(user);
        throw new ForbiddenException(
          `Too many failed attempts. Locked until ${user.lockoutUntil}`,
        );
      }

      await this.userRepository.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Reset failed attempts on success
    user.failedAttempts = 0;
    user.lockoutUntil = null;
    await this.userRepository.save(user);

    await this.authLogRepository.save(
      this.authLogRepository.create({
        user: user,
        ipAddress: res.req?.ip ?? 'Unknown',
        device: res.req?.headers['user-agent'] ?? 'Unknown device',
      }),
    );

    // 4. Prepare sanitized user (exclude password)
    const { password: _, profileImage, ...rest } = user;
    const payloadUser: PayloadUser = rest;

    // 5. Generate tokens (payload = full user without password)
    const accessToken = await this.jwtService.signAsync(payloadUser, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_EXPIRATION as any,
    });

    const refreshToken = await this.jwtService.signAsync(payloadUser, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRATION as any,
    });

    /** NEW */
    // --- SESSION COOKIE (1 day) ---
    const session = new Session();
    session.user = user;
    session.ipAddress = res.req?.ip ?? 'Unknown';
    session.device = res.req?.headers['user-agent'] ?? 'Unknown device';
    session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    await this.sessionRepository.save(session);

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // --- CSRF TOKEN COOKIE ---
    const csrfToken = randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const tokenName = process.env.TOKEN_NAME ?? '_auth_token_';
    const refreshExp = process.env.REFRESH_EXPIRATION ?? '30d';

    // 6. Store refresh token in HTTP-only cookie
    res.cookie(tokenName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: this.parseExpiration(refreshExp),
    });

    const successMessage = `Login successful. Welcome back, ${user.fullname}!`;

    this.notificationsService.broadcastGlobal({
      title: 'A User has logged in',
      description: `User ${user.fullname} has logged in to the system.`,
      data: {
        userId: user.id,
        username: user.username,
        loginTime: new Date().toISOString(),
      },
    });

    return {
      accessToken,
      message: successMessage,
      user: {
        ...payloadUser,
        profileImage,
      },
    };
  }

  /** ---------------- LOGOUT ALL DEVICES ---------------- */
  async logoutAllDevices(userId: string, res: Response) {
    // Delete all active sessions for this user
    await this.sessionRepository.delete({ user: { id: userId } });

    this.clearSessionCookies(res);

    return { message: `Logged out user ${userId} from all devices` };
  }

  /** ---------------- LOGOUT SPECIFIC SESSION ---------------- */
  async logout(sessionId: string | undefined, res: Response) {
    if (sessionId) {
      await this.sessionRepository.delete({ id: sessionId });
    }

    this.clearSessionCookies(res);

    return { message: 'Logged out successfully' };
  }

  /** ---------------- VALIDATE SESSION ---------------- */
  async validateSession(sessionId: string) {
    if (!sessionId) throw new UnauthorizedException('Session not found');

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session || session.expiresAt < new Date())
      throw new UnauthorizedException('Session expired');

    return session.user;
  }

  /** 2FA Passkey Authentication */
  async authenticatePasskey(userId: string, passKey: string, res: Response) {
    if (!userId || !passKey) {
      throw new BadRequestException('User ID and passkey are required');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'fullname', 'username', 'email', 'passKey'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passKey) {
      this.clearSessionCookies(res);
      throw new ForbiddenException(
        'You don’t have a 2FA passkey. Contact the system administrator to set one up.',
      );
    }

    const isMatch = await this.hashingService.compare(passKey, user.passKey);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid 2FA passkey. Please try again.');
    }

    const payloadUser = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
    };

    const passkeyToken = await this.jwtService.signAsync(payloadUser, {
      secret: process.env.PASSKEY_SECRET,
      expiresIn: process.env.PASSKEY_EXPIRATION as any,
    });

    const passkeyCookieName =
      process.env.PASSKEY_TOKEN_NAME ?? '_passkey_token_';
    const passkeyExp = process.env.PASSKEY_EXPIRATION ?? '30d';

    // 🛡️ Set cookie (HTTP-only, secure)
    res.cookie(passkeyCookieName, passkeyToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: this.parseExpiration(passkeyExp),
    });

    // ✅ Return simplified response
    return {
      status: true,
      message: 'Successfully authenticated 2FA passkey.',
      isAuthenticated: true,
      user: payloadUser,
    };
  }

  /** Authentication but for PassKey */

  /** Refresh token */
  async refreshTokens(
    refreshToken: string,
    sessionId: string,
    res: Response,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });

    const { iat, exp, ...userPayload } = payload;

    const newAccessToken = await this.jwtService.signAsync(userPayload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_EXPIRATION as any,
    });

    if (sessionId) {
      const session = await this.sessionRepository.findOne({
        where: { id: sessionId },
        relations: ['user'],
      });

      if (!session) {
        // No session found at all
        this.clearSessionCookies(res);
        throw new UnauthorizedException('Session not found');
      }

      if (session.expiresAt < new Date()) {
        // Session expired → cleanup DB + clear cookies
        await this.sessionRepository.delete({ id: sessionId });
        this.clearSessionCookies(res);
        throw new UnauthorizedException('Session expired, please log in again');
      }

      // Extend session by 1 day only if less than 6 hours left
      const remaining = session.expiresAt.getTime() - Date.now();
      if (remaining < 6 * 60 * 60 * 1000) {
        session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.sessionRepository.save(session);
      }

      // Reset session cookie
      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }

    // Refresh CSRF token each time tokens are refreshed
    const newCsrfToken = randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', newCsrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { accessToken: newAccessToken };
  }

  /** Unlock Account */
  async unlockAccount(email: string): Promise<{ message: string }> {
    if (!email) throw new NotFoundException('Email is required');

    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser) throw new NotFoundException('Account not found');

    findUser.failedAttempts = 0;
    findUser.lockoutUntil = null;
    await this.userRepository.save(findUser);
    return { message: `Account for ${email} has been unlocked` };
  }

  async authCheck(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token cookie required');
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_SECRET,
    });

    const { iat, exp, id } = payload;
    if (!id) throw new UnauthorizedException('Invalid token payload');

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roleId', 'userPermissions.permission'],
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, userPermissions, ...safeUser } = user;

    const permissions = userPermissions.map((up) => up.permission);

    return {
      ...safeUser,
      permissions,
    };
  }

  async getAllPaginatedAuthLogs(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};

    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }
    return this.authLogPagination.paginate(this.authLogRepository, 'auth_log', {
      page: page || 1,
      limit: limit || 10,
      keyword: keyword || '',
      searchableFields: [
        'ipAddress',
        'device',
        'user.fullname',
        'user.username',
        'user.email',
      ],
      sortableFields: [
        'ipAddress',
        'device',
        'user.fullname',
        'user.username',
        'user.email',
      ],
      sortBy: (sortBy?.trim() as keyof AuthLog) || 'timestamp',
      sortOrder: sortOrder || 'desc',
      dataKey: 'auth_logs_data',
      relations: ['user'],
      filters: parsedFilters,
      // withDeleted: true,
    });
  }

  /** Get Auth Logs by User ID */
  async getAuthLogsByUser(
    userId: string,
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.authLogPagination.paginate(
      this.authLogRepository,
      'auth_logs',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: [
          'id',
          'ipAddress',
          'device',
          'user.fullname',
          'user.username',
          'user.email',
        ],
        sortableFields: [
          'ipAddress',
          'device',
          'user.fullname',
          'user.username',
          'user.email',
        ],
        sortBy: (sortBy?.trim() as keyof AuthLog) || 'timestamp',
        sortOrder,
        dataKey: 'auth_logs_data',
        relations: ['user'],
        filters: { 'user.id': userId }, // 👈 this filters by user
      },
    );
  }
}
