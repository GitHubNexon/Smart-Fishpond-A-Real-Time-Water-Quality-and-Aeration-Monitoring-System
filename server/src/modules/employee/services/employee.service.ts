import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeePersonalInfo } from '../entities/personal-info.entity';
import { EmployeeContactInfo } from '../entities/contact-info.entity';
import { EmployeeAddressInfo } from '../entities/address-info.entity';
import { EmployeeGovernmentInfo } from '../entities/government-info.entity';
import { EmployeeFamilyInfo } from '../entities/family-info.entity';
import { EmployeeEducationalInfo } from '../entities/educational-info.entity';
import { EmployeeWorkExperienceInfo } from '../entities/work-experience-info.entity';
import { EmployeeChildrenInfo } from '../entities/children-info.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AuditService } from 'src/modules/audit/audit.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationsSocketService } from 'src/modules/sockets/notifications/notifications.socket.service';
import { PatchService } from 'src/utils/services/patch.service';
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';
import { isUUID } from 'class-validator';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeePersonalInfo)
    private employeePersonalInfoRepository: Repository<EmployeePersonalInfo>,
    @InjectRepository(EmployeeContactInfo)
    private employeeContactInfoRepository: Repository<EmployeeContactInfo>,
    @InjectRepository(EmployeeAddressInfo)
    private employeeAddressInfoRepository: Repository<EmployeeAddressInfo>,
    @InjectRepository(EmployeeGovernmentInfo)
    private employeeGovernmentInfoRepository: Repository<EmployeeGovernmentInfo>,
    @InjectRepository(EmployeeFamilyInfo)
    private employeeFamilyInfoRepository: Repository<EmployeeFamilyInfo>,
    @InjectRepository(EmployeeEducationalInfo)
    private employeeEducationalInfoRepository: Repository<EmployeeEducationalInfo>,
    @InjectRepository(EmployeeWorkExperienceInfo)
    private employeeWorkExperienceInfoRepository: Repository<EmployeeWorkExperienceInfo>,
    @InjectRepository(EmployeeChildrenInfo)
    private employeeChildrenInfoRepository: Repository<EmployeeChildrenInfo>,
    private auditService: AuditService,
    private notificationService: NotificationsService,
    private notifSocketService: NotificationsSocketService,
    private patchService: PatchService<any>,
    private readonly employeePaginationService: PaginationService<Employee>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    currentUser: User,
  ): Promise<Employee> {
    const {
      employeeId,
      personalInfo,
      contactInfo,
      addressInfo,
      governmentInfo,
      familyInfo,
      educationalInfo,
      workExperienceInfo,
    } = createEmployeeDto;

    // Check if employeeId already exists
    const existingEmployee = await this.employeeRepository.findOne({
      where: { employeeId },
    });
    if (existingEmployee) {
      throw new ConflictException('Employee ID already exists');
    }

    // Create personal info (required)
    const newPersonalInfo =
      this.employeePersonalInfoRepository.create(personalInfo);

    // Create optional nested entities (don't save yet, cascade will handle it)
    let newContactInfo: EmployeeContactInfo | undefined = undefined;
    if (contactInfo && Object.keys(contactInfo).length > 0) {
      newContactInfo = this.employeeContactInfoRepository.create(contactInfo);
    }

    let newAddressInfo: EmployeeAddressInfo | undefined = undefined;
    if (addressInfo && Object.keys(addressInfo).length > 0) {
      newAddressInfo = this.employeeAddressInfoRepository.create(addressInfo);
    }

    let newGovernmentInfo: EmployeeGovernmentInfo | undefined = undefined;
    if (governmentInfo && Object.keys(governmentInfo).length > 0) {
      newGovernmentInfo =
        this.employeeGovernmentInfoRepository.create(governmentInfo);
    }

    let newFamilyInfo: EmployeeFamilyInfo | undefined = undefined;
    if (
      familyInfo &&
      Object.keys(familyInfo).filter((key) => key !== 'children').length > 0
    ) {
      const { children, ...familyData } = familyInfo;
      newFamilyInfo = this.employeeFamilyInfoRepository.create(familyData);

      // Create children if provided (cascade will save these too)
      if (children && children.length > 0) {
        const childrenEntities = children.map((child) =>
          this.employeeChildrenInfoRepository.create(child),
        );
        newFamilyInfo.children = childrenEntities;
      }
    }

    let newEducationalInfo: EmployeeEducationalInfo | undefined = undefined;
    if (educationalInfo && Object.keys(educationalInfo).length > 0) {
      newEducationalInfo =
        this.employeeEducationalInfoRepository.create(educationalInfo);
    }

    // Create main Employee entity (cascade will save all relations)
    const newEmployee = this.employeeRepository.create({
      employeeId,
      personalInfo: newPersonalInfo,
      ...(newContactInfo && { contactInfo: newContactInfo }),
      ...(newAddressInfo && { addressInfo: newAddressInfo }),
      ...(newGovernmentInfo && { governmentInfo: newGovernmentInfo }),
      ...(newFamilyInfo && { familyInfo: newFamilyInfo }),
      ...(newEducationalInfo && { educationalInfo: newEducationalInfo }),
      isVerified: false,
      preparedBy: currentUser,
    });

    // Save employee - cascade will save all related entities
    const savedEmployee = await this.employeeRepository.save(newEmployee);

    // Create work experience records if provided (these are OneToMany, need manual save)
    if (workExperienceInfo && workExperienceInfo.length > 0) {
      const workExperiences = workExperienceInfo.map((work) =>
        this.employeeWorkExperienceInfoRepository.create({
          ...work,
          employee: savedEmployee,
        }),
      );
      await this.employeeWorkExperienceInfoRepository.save(workExperiences);
    }

    const TxID = `TX_EMPLOYEE-${savedEmployee.id}`;

    // Audit log
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'CREATE',
      title: `Employee Created: ${personalInfo.firstName} ${personalInfo.middleName ?? ''} ${personalInfo.lastName}`,
      before: null,
      after: savedEmployee,
    });

    // Notification logs
    await this.notificationService.notificationLogs({
      title: 'Employee Created',
      description: `Employee Record Created: ${personalInfo.firstName} ${personalInfo.middleName ?? ''} ${personalInfo.lastName}`,
      actions: 'READ',
      status: 'NORMAL',
      url: `/employees/${employeeId}`,
      author: currentUser,
    });

    // Socket broadcast
    this.notifSocketService.broadcastGlobal({
      title: 'Employee Created',
      description: `Employee Record Created: ${personalInfo.firstName} ${personalInfo.middleName ?? ''} ${personalInfo.lastName}`,
      data: {
        author: {
          id: currentUser.id,
          fullname: currentUser.fullname,
        },
      },
    });

    return savedEmployee;
  }

  async updateEmployee(
    employeeId: string,
    updateEmployeeDto: UpdateEmployeeDto,
    currentUser: User,
  ): Promise<{ old_data: Record<string, any>; new_data: Employee }> {
    // Fetch main employee record with relations
    const employeeRecord = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: [
        'personalInfo',
        'contactInfo',
        'addressInfo',
        'governmentInfo',
        'familyInfo',
        'familyInfo.children',
        'educationalInfo',
        'workExperienceInfo',
      ],
    });

    if (!employeeRecord) {
      throw new NotFoundException(`Employee not found with ID ${employeeId}`);
    }

    const {
      personalInfo,
      contactInfo,
      addressInfo,
      governmentInfo,
      familyInfo,
      educationalInfo,
      workExperienceInfo,
      ...mainFields
    } = updateEmployeeDto;

    const patchResults: Record<string, any> = {};

    // Patch nested entities if provided
    if (personalInfo && employeeRecord.personalInfo) {
      patchResults.personalInfo = await this.patchService.patch(
        this.employeePersonalInfoRepository,
        employeeRecord.personalInfo.id,
        personalInfo as Partial<EmployeePersonalInfo>,
        { patchBy: 'id', title: 'Personal Info Update' },
      );
    }

    if (contactInfo && employeeRecord.contactInfo) {
      patchResults.contactInfo = await this.patchService.patch(
        this.employeeContactInfoRepository,
        employeeRecord.contactInfo.id,
        contactInfo as Partial<EmployeeContactInfo>,
        { patchBy: 'id', title: 'Contact Info Update' },
      );
    }

    if (addressInfo && employeeRecord.addressInfo) {
      patchResults.addressInfo = await this.patchService.patch(
        this.employeeAddressInfoRepository,
        employeeRecord.addressInfo.id,
        addressInfo as Partial<EmployeeAddressInfo>,
        { patchBy: 'id', title: 'Address Info Update' },
      );
    }

    if (governmentInfo && employeeRecord.governmentInfo) {
      patchResults.governmentInfo = await this.patchService.patch(
        this.employeeGovernmentInfoRepository,
        employeeRecord.governmentInfo.id,
        governmentInfo as Partial<EmployeeGovernmentInfo>,
        { patchBy: 'id', title: 'Government Info Update' },
      );
    }

    if (familyInfo && employeeRecord.familyInfo) {
      const { children, ...familyData } = familyInfo;

      patchResults.familyInfo = await this.patchService.patch(
        this.employeeFamilyInfoRepository,
        employeeRecord.familyInfo.id,
        familyData as Partial<EmployeeFamilyInfo>,
        { patchBy: 'id', title: 'Family Info Update' },
      );

      // Handle children updates if provided
      if (children) {
        // Remove existing children
        await this.employeeChildrenInfoRepository.delete({
          familyInfo: { id: employeeRecord.familyInfo.id },
        });

        // Create new children
        if (children.length > 0) {
          const childrenEntities = children.map((child) =>
            this.employeeChildrenInfoRepository.create({
              ...child,
              familyInfo: employeeRecord.familyInfo!,
            }),
          );
          await this.employeeChildrenInfoRepository.save(childrenEntities);
        }
      }
    }

    if (educationalInfo && employeeRecord.educationalInfo) {
      patchResults.educationalInfo = await this.patchService.patch(
        this.employeeEducationalInfoRepository,
        employeeRecord.educationalInfo.id,
        educationalInfo as Partial<EmployeeEducationalInfo>,
        { patchBy: 'id', title: 'Educational Info Update' },
      );
    }

    // Handle work experience updates
    if (workExperienceInfo) {
      // Remove existing work experiences
      await this.employeeWorkExperienceInfoRepository.delete({
        employee: { id: employeeRecord.id },
      });

      // Create new work experiences
      if (workExperienceInfo.length > 0) {
        const workExperiences = workExperienceInfo.map((work) =>
          this.employeeWorkExperienceInfoRepository.create({
            ...work,
            employee: employeeRecord,
          }),
        );
        await this.employeeWorkExperienceInfoRepository.save(workExperiences);
      }
    }

    // Patch main Employee fields
    if (Object.keys(mainFields).length > 0) {
      patchResults.employeeRecord = await this.patchService.patch(
        this.employeeRepository,
        employeeRecord.id,
        mainFields as Partial<Employee>,
        { patchBy: 'id', title: 'Employee Record Update' },
      );
    }

    // Audit log
    const TxID = `TX_EMPLOYEE-${employeeRecord.id}`;
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'UPDATE',
      title: `Employee Updated: ${employeeRecord.personalInfo.firstName} ${employeeRecord.personalInfo.lastName}`,
      before: employeeRecord,
      after: { ...employeeRecord, ...updateEmployeeDto },
    });

    // Notification
    await this.notificationService.notificationLogs({
      title: 'Employee Updated',
      description: `Employee Record Updated: ${employeeRecord.personalInfo.firstName} ${employeeRecord.personalInfo.lastName}`,
      actions: 'READ',
      status: 'NORMAL',
      url: `/employees/${employeeId}`,
      author: currentUser,
    });

    // Socket broadcast
    this.notifSocketService.broadcastGlobal({
      title: 'Employee Updated',
      description: `Employee Record Updated: ${employeeRecord.personalInfo.firstName} ${employeeRecord.personalInfo.lastName}`,
      data: {
        author: { id: currentUser.id, fullname: currentUser.fullname },
      },
    });

    // Return fully loaded updated employee
    const updatedEmployee = await this.employeeRepository.findOne({
      where: { id: employeeRecord.id },
      relations: [
        'personalInfo',
        'contactInfo',
        'addressInfo',
        'governmentInfo',
        'familyInfo',
        'familyInfo.children',
        'educationalInfo',
        'workExperienceInfo',
      ],
    });

    if (!updatedEmployee) {
      throw new NotFoundException('Updated employee not found');
    }

    return { old_data: patchResults, new_data: updatedEmployee };
  }

  async getAllPaginatedEmployees(
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

    return this.employeePaginationService.paginate(
      this.employeeRepository,
      'employees',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: [
          'employeeId',
          'personalInfo.firstName',
          'personalInfo.middleName',
          'personalInfo.lastName',
        ],
        sortableFields: ['employeeId'],
        sortBy: (sortBy?.trim() as keyof Employee) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'employee_data',
        relations: [
          'user',
          'personalInfo',
          'contactInfo',
          'addressInfo',
          'governmentInfo',
          'familyInfo',
          'familyInfo.children',
          'educationalInfo',
          'workExperienceInfo',
          'coreWorkInfo',
        ],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }

  async getEmployeeById(idOrEmployeeId: string) {
    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.personalInfo', 'personalInfo')
      .leftJoinAndSelect('employee.contactInfo', 'contactInfo')
      .leftJoinAndSelect('employee.addressInfo', 'addressInfo')
      .leftJoinAndSelect('employee.governmentInfo', 'governmentInfo')
      .leftJoinAndSelect('employee.familyInfo', 'familyInfo')
      .leftJoinAndSelect('familyInfo.children', 'children')
      .leftJoinAndSelect('employee.educationalInfo', 'educationalInfo')
      .leftJoinAndSelect('employee.workExperienceInfo', 'workExperienceInfo')
      .leftJoinAndSelect('employee.coreWorkInfo', 'coreWorkInfo')
      .leftJoinAndSelect('employee.preparedBy', 'preparedBy')
      .leftJoinAndSelect('employee.verifiedBy', 'verifiedBy')
      .leftJoinAndSelect('employee.approvedBy', 'approvedBy')
      .withDeleted();

    // Add sorting for coreWorkInfo
    query.orderBy('coreWorkInfo.createdAt', 'DESC'); // or DESC

    if (isUUID(idOrEmployeeId)) {
      query.where('employee.id = :id', { id: idOrEmployeeId });
    } else {
      query.where('employee.employeeId = :employeeId', {
        employeeId: idOrEmployeeId,
      });
    }

    const employee = await query.getOne();

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID or Employee ID ${idOrEmployeeId} not found`,
      );
    }

    return employee;
  }

  async verifyEmployee(id: string, currentUser: User): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['personalInfo'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    if (employee.isVerified) {
      throw new BadRequestException('Employee is already verified');
    }

    const beforeUpdate = { ...employee };

    employee.isVerified = true;
    employee.verifiedBy = currentUser;
    employee.verifiedAt = new Date();
    const updatedEmployee = await this.employeeRepository.save(employee);

    const TxID = `TX_EMPLOYEE-${updatedEmployee.id}`;

    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'VERIFIED',
      title: `Employee Verified ${updatedEmployee.personalInfo?.firstName} ${updatedEmployee.personalInfo?.middleName} ${updatedEmployee.personalInfo?.lastName}`,
      before: beforeUpdate,
      after: updatedEmployee,
    });

    return updatedEmployee;
  }
}
