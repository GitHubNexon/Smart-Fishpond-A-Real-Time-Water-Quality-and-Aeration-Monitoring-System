import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/rbac/entities/permission.entity';
import { Roles } from 'src/modules/rbac/entities/roles.entity';
import { UserPermissions } from 'src/modules/rbac/entities/user-permission.entity';
import { AuthLog } from 'src/modules/auth/entities/auth-log.entity';

//employee
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
const isSSL = process.env.DB_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
  migrations: ['migrations/*.ts'],
  synchronize: true,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});
