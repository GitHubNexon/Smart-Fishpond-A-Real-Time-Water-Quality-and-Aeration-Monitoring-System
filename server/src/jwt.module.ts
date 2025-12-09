import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_EXPIRATION as any,
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
