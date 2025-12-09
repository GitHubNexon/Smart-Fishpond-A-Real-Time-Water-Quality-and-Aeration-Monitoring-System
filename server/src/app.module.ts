import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules.module';
import { SharedModule } from './shared.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtGlobalModule } from './jwt.module';
import { MaintenanceMiddleware } from './common/middleware/maintenance.middleware';
import { User } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/rbac/entities/permission.entity';
import { Roles } from 'src/modules/rbac/entities/roles.entity';
import { UserPermissions } from 'src/modules/rbac/entities/user-permission.entity';
import { AuthLog } from 'src/modules/auth/entities/auth-log.entity';

import { Employee } from 'src/modules/employee/entities/employee.entity';
import { EmployeeAddressInfo } from 'src/modules/employee/entities/address-info.entity';
import { EmployeeChildrenInfo } from 'src/modules/employee/entities/children-info.entity';
import { EmployeeContactInfo } from 'src/modules/employee/entities/contact-info.entity';
import { EmployeeFamilyInfo } from 'src/modules/employee/entities/family-info.entity';
import { EmployeeGovernmentInfo } from 'src/modules/employee/entities/government-info.entity';
import { EmployeePersonalInfo } from 'src/modules/employee/entities/personal-info.entity';
import { EmployeeWorkExperienceInfo } from 'src/modules/employee/entities/work-experience-info.entity';
import { EmployeeEducationalInfo } from 'src/modules/employee/entities/educational-info.entity';
import { EmployeeCoreWorkInfo } from 'src/modules/employee/entities/employee-work-info.entity';


import { Session } from 'src/modules/auth/entities/session.entity';
import { AuditLog } from 'src/modules/audit/entities/audit-log.entity';
import { Notifications } from 'src/modules/notifications/entities/notification.entity';
import {
  ChatSession,
  ChatEmbedding,
  ChatMessage,
} from './modules/ai-chat/entities/ai-chat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isSSL = configService.get<string>('DB_SSL') === 'true';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          schema: 'public',
          // autoLoadEntities: true,
          entities: [
            User,
            Permissions,
            Roles,
            UserPermissions,
            AuthLog,
            Employee,
            EmployeeAddressInfo,
            EmployeeChildrenInfo,
            EmployeeContactInfo,
            EmployeeFamilyInfo,
            EmployeeGovernmentInfo,
            EmployeePersonalInfo,
            EmployeeWorkExperienceInfo,
            EmployeeEducationalInfo,
            EmployeeCoreWorkInfo,
            Session,
            AuditLog,
            Notifications,
            ChatSession,
            ChatEmbedding,
            ChatMessage,
          ],
          synchronize: configService.get<string>('NODE_ENV') === 'development',
          ssl: isSSL ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    ModulesModule,
    SharedModule,
    JwtGlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MaintenanceMiddleware).forRoutes('*');
  }
}
