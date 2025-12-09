// src/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // populated by JwtAuthGuard or SessionGuard
  },
);
