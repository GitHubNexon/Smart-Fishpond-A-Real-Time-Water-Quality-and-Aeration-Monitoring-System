import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Employee } from '../entities/employee.entity';
import { AuditService } from 'src/modules/audit/audit.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationsSocketService } from 'src/modules/sockets/notifications/notifications.socket.service';
import { PatchService } from 'src/utils/services/patch.service';
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';
import { CreateEmployeeJobDetailsDto } from '../dto/create-employee-job-details.dto';
import { UpdateEmployeeJobDetailsDto } from '../dto/update-employee-job-details.dto';
import { EmployeeCoreWorkInfo } from '../entities/employee-work-info.entity';
import { EmploymentValidationService } from './employment-validation.service';

@Injectable()
export class JobDetailsService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeCoreWorkInfo)
    private coreWorkInfoRepository: Repository<EmployeeCoreWorkInfo>,
    private auditService: AuditService,
    private notificationService: NotificationsService,
    private notifSocketService: NotificationsSocketService,
    private patchService: PatchService<any>,
    private readonly jobDetailsPaginationService: PaginationService<EmployeeCoreWorkInfo>,
    private readonly employmentValidationService: EmploymentValidationService,
  ) {}

  async createEmployeeJobDetails(
    createEmployeeJobDetails: CreateEmployeeJobDetailsDto,
    currentUser: User,
  ): Promise<EmployeeCoreWorkInfo> {
    const {
      employee,
      position,
      department,
      employmentType,
      employmentStatus,
      dateHired,
      dateRegularized,
      contractStartDate,
      contractEndDate,
      probationPeriodEnd,
      resignedDate,
      terminatedDate,
      retiredDate,
      terminationReason,
      terminationNotes,
      resignationReason,
      resignationNotes,
      retirementNotes,
    } = createEmployeeJobDetails;

    // Validate employee exists
    const validEmployee = await this.employeeRepository.findOne({
      where: { id: employee },
    });
    if (!validEmployee) {
      throw new BadRequestException('Invalid Employee ID');
    }

    // Check if employee has unverified job details
    const unverifiedJobDetails = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employee },
        isVerified: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (unverifiedJobDetails) {
      throw new BadRequestException(
        `Employee has unverified job details (ID: ${unverifiedJobDetails.id}). ` +
          `Please verify or delete the existing record before creating a new one.`,
      );
    }

    await this.employmentValidationService.validateNewJobDetails(
      employee,
      employmentType,
      employmentStatus,
      dateHired,
      probationPeriodEnd,
      contractStartDate,
      contractEndDate,
      resignedDate,
      terminatedDate,
      retiredDate,
      terminationReason,
    );

    // Create new job details record
    const newJobDetailsRecord = this.coreWorkInfoRepository.create({
      employee: { id: employee } as Employee,
      position,
      department,
      employmentType,
      employmentStatus,
      dateHired,
      dateRegularized,
      contractStartDate,
      contractEndDate,
      probationPeriodEnd,
      resignedDate,
      terminatedDate,
      retiredDate,
      terminationReason,
      terminationNotes,
      resignationReason,
      resignationNotes,
      retirementNotes,
      preparedBy: currentUser,
    });

    const savedRecord =
      await this.coreWorkInfoRepository.save(newJobDetailsRecord);

    const TxID = `TX_EMP-JOB-DETAILS-${savedRecord.id}`;

    // Audit log
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'CREATE',
      title: `Employee Job Details Created 
      ${savedRecord.employee?.personalInfo?.firstName} 
      ${savedRecord.employee?.personalInfo?.middleName} 
      ${savedRecord.employee?.personalInfo?.lastName}`,
      before: savedRecord,
      after: savedRecord,
    });

    return savedRecord;
  }

  async updatedEmployeeJobDetails(
    id: string,
    updateEmployeeJobDetails: UpdateEmployeeJobDetailsDto,
    currentUser: User,
  ): Promise<{
    old_data: Partial<EmployeeCoreWorkInfo>;
    new_data: EmployeeCoreWorkInfo;
  }> {
    const jobDetails = await this.coreWorkInfoRepository.findOne({
      where: { id },
      relations: ['preparedBy', 'employee'],
    });

    if (!jobDetails) throw new NotFoundException('job details not found');

    if (jobDetails.isVerified) {
      throw new BadRequestException(
        `Cannot update verified job details (ID: ${id}). ` +
          `Verified records are locked and cannot be modified. ` +
          `To make changes, create a new job details record instead.`,
      );
    }

    if (
      updateEmployeeJobDetails.employmentType ||
      updateEmployeeJobDetails.employmentStatus
    ) {
      const newEmploymentType =
        updateEmployeeJobDetails.employmentType || jobDetails.employmentType;
      const newEmploymentStatus =
        updateEmployeeJobDetails.employmentStatus ||
        jobDetails.employmentStatus;

      await this.employmentValidationService.validateNewJobDetails(
        jobDetails.employee.id,
        newEmploymentType,
        newEmploymentStatus,
        updateEmployeeJobDetails.dateHired || jobDetails.dateHired,
        updateEmployeeJobDetails.probationPeriodEnd ||
          jobDetails.probationPeriodEnd,
        updateEmployeeJobDetails.contractStartDate ||
          jobDetails.contractStartDate,
        updateEmployeeJobDetails.contractEndDate || jobDetails.contractEndDate,
        updateEmployeeJobDetails.resignedDate || jobDetails.resignedDate,
        updateEmployeeJobDetails.terminatedDate || jobDetails.terminatedDate,
        updateEmployeeJobDetails.retiredDate || jobDetails.retiredDate,
        updateEmployeeJobDetails.terminationReason ||
          jobDetails.terminationReason,
      );
    }

    const patched = await this.patchService.patch(
      this.coreWorkInfoRepository,
      id,
      updateEmployeeJobDetails,
      {
        patchBy: 'id',
        title: 'Job Details Update',
        description: `Job Details ${id} updated`,
        relations: ['employee'],
      },
    );

    const TxID = `TX_EMP-JOB-DETAILS-${patched.new_data.id}`;

    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      title: `Job Details Updated`,
      action: 'UPDATE',
      before: patched.old_data,
      after: patched.new_data,
    });

    return {
      old_data: patched.old_data,
      new_data: patched.new_data,
    };
  }

  async getAllPaginatedJobDetails(
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

    return this.jobDetailsPaginationService.paginate(
      this.coreWorkInfoRepository,
      'employee-core-work-info',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: [
          'employee.employeeId',
          'employee.personalInfo.firstName',
          'employee.personalInfo.middleName',
          'employee.personalInfo.lastName',
        ],
        sortableFields: ['employee.employeeId'],
        sortBy: (sortBy?.trim() as keyof EmployeeCoreWorkInfo) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'job_details_data',
        relations: ['preparedBy', 'employee','employee.personalInfo'],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }
}
