import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { Roles } from './entities/roles.entity';
import { Permissions } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { UserPermissions } from './entities/user-permission.entity';
import { SharedModule } from 'src/shared.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Roles,
      Permissions,
      UserPermissions,
    ]),
    SharedModule,
    AuthModule,
  ],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
