import { Module, forwardRef } from '@nestjs/common';
// services
import { EmployeeService } from './services/employee.service';
import { JobDetailsService } from './services/job-details.service';
import { EmploymentValidationService } from './services/employment-validation.service';

//controllers
import { EmployeeController } from './controller/employee.controller';
import { JobDetailsController } from './controller/job-details.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from 'src/modules/users/entities/user.entity';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SocketModule } from 'src/modules/sockets/socket.module';

import { Employee } from './entities/employee.entity';
import { EmployeeAddressInfo } from 'src/modules/employee/entities/address-info.entity';
import { EmployeeChildrenInfo } from 'src/modules/employee/entities/children-info.entity';
import { EmployeeContactInfo } from 'src/modules/employee/entities/contact-info.entity';
import { EmployeeFamilyInfo } from 'src/modules/employee/entities/family-info.entity';
import { EmployeeGovernmentInfo } from 'src/modules/employee/entities/government-info.entity';
import { EmployeePersonalInfo } from 'src/modules/employee/entities/personal-info.entity';
import { EmployeeWorkExperienceInfo } from './entities/work-experience-info.entity';
import { EmployeeEducationalInfo } from './entities/educational-info.entity';
import { EmployeeCoreWorkInfo } from './entities/employee-work-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
      User,
    ]),
    SharedModule,
    AuthModule,
    AuditModule,
    NotificationsModule,
    SocketModule,
  ],
  controllers: [EmployeeController, JobDetailsController],
  providers: [EmployeeService, JobDetailsService, EmploymentValidationService],
  exports: [EmployeeService, JobDetailsService, EmploymentValidationService],
})
export class EmployeeModule {}
