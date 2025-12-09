// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request as NestRequest,
  Param,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.authenticate(
      loginRequestDto.email,
      loginRequestDto.password,
      res,
    );
  }

  /*
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: ExpressRequest) {
    const tokenName = process.env.TOKEN_NAME ?? '_auth_token_';
    const refreshToken = req.cookies[tokenName];
    return this.authService.refreshTokens(refreshToken);
  }
  */

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenName = process.env.TOKEN_NAME ?? '_auth_token_';
    const refreshToken = req.cookies[tokenName];
    const sessionId = req.cookies['sessionId'];
    return this.authService.refreshTokens(refreshToken, sessionId, res);
  }

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async checkAuth(@NestRequest() req: ExpressRequest) {
    const tokenName = process.env.TOKEN_NAME ?? '_auth_token_';
    const refreshToken = req.cookies[tokenName];
    return this.authService.authCheck(refreshToken);
  }

  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // async logout(@Res({ passthrough: true }) res: Response) {
  //   // Clear cookies
  //   const isProd = process.env.NODE_ENV === 'production';
  //   const sameSite = isProd ? 'none' : 'lax';

  //   res.clearCookie('sessionId', {
  //     httpOnly: true,
  //     secure: isProd,
  //     sameSite,
  //   });

  //   res.clearCookie(process.env.TOKEN_NAME ?? '_auth_token_', {
  //     httpOnly: true,
  //     secure: isProd,
  //     sameSite,
  //   });

  //   res.clearCookie(process.env.PASSKEY_TOKEN_NAME ?? '_passkey_token_', {
  //     httpOnly: true,
  //     secure: isProd,
  //     sameSite,
  //   });

  //   res.clearCookie('XSRF-TOKEN', {
  //     httpOnly: false,
  //     secure: isProd,
  //     sameSite,
  //   });

  //   return { message: 'Logged out successfully' };
  // }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = req.cookies['sessionId'];

    return this.authService.logout(sessionId, res);
  }

  @Post('logout-all/:userId')
  @HttpCode(HttpStatus.OK)
  async logoutAllDevices(
    @Param('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutAllDevices(userId, res);
  }

  @Post('unlock')
  @HttpCode(HttpStatus.OK)
  async unlockAccount(@Body('email') email: string) {
    return this.authService.unlockAccount(email);
  }

  @Post('verify-passkey')
  @HttpCode(HttpStatus.OK)
  async verifyPasskey(
    @Body('userId') userId: string,
    @Body('passKey') passKey: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.authenticatePasskey(userId, passKey, res);
  }

  @Get('get-all-auth-logs')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedAuthLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.authService.getAllPaginatedAuthLogs(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Auth Logs fetched successfully',
      ...result,
    };
  }

  @Get('user-logs/:userId')
  @HttpCode(HttpStatus.OK)
  async getAuthLogsByUser(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const result = await this.authService.getAuthLogsByUser(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      sortBy,
      sortOrder,
    );

    return {
      status: 'success',
      message: `Auth logs for user ${userId} fetched successfully`,
      ...result,
    };
  }
}
