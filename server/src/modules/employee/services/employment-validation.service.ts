import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Between,
  Not,
} from 'typeorm';
import { EmployeeCoreWorkInfo } from '../entities/employee-work-info.entity';
import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
} from '../enums/employee.enum';

@Injectable()
export class EmploymentValidationService {
  constructor(
    @InjectRepository(EmployeeCoreWorkInfo)
    private coreWorkInfoRepository: Repository<EmployeeCoreWorkInfo>,
  ) {}

  /**
   * Validates if a new job detail can be created based on employment lifecycle rules
   */
  async validateNewJobDetails(
    employeeId: string,
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
    dateHired?: Date,
    probationPeriodEnd?: Date,
    contractStartDate?: Date,
    contractEndDate?: Date,
    resignedDate?: Date,
    terminatedDate?: Date,
    retiredDate?: Date,
    terminationReason?: 'for_cause' | 'without_cause',
  ): Promise<void> {
    // ✅ FIXED: Now passes terminationReason to validateExitDates
    this.validateExitDates(
      newEmploymentStatus,
      newEmploymentType,
      resignedDate,
      terminatedDate,
      retiredDate,
      terminationReason,
    );

    // Check for duplicate active job details
    await this.checkForDuplicateActiveJobDetails(
      employeeId,
      newEmploymentType,
      newEmploymentStatus,
    );

    // Check if employee is already in a terminal status
    await this.checkTerminalStatus(employeeId, newEmploymentStatus);

    // Get the latest verified job details for this employee
    const latestJobDetails = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employeeId },
        isVerified: true,
      },
      order: { createdAt: 'DESC' },
    });

    // Also check for any unverified active records
    const unverifiedActive = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employeeId },
        isVerified: false,
        employmentStatus: EmploymentStatusEnum.ACTIVE,
      },
      order: { createdAt: 'DESC' },
    });

    // If there are unverified active records, use the most recent one for validation
    const recordToValidate = unverifiedActive || latestJobDetails;

    // If no previous records, validate first-time employment
    if (!recordToValidate) {
      this.validateFirstTimeEmployment(
        newEmploymentType,
        newEmploymentStatus,
        dateHired,
        probationPeriodEnd,
      );
      return;
    }

    // Check if employee is currently terminated and being re-hired
    if (
      [
        EmploymentStatusEnum.TERMINATED,
        EmploymentStatusEnum.RESIGNED,
        EmploymentStatusEnum.RETIRED,
      ].includes(recordToValidate.employmentStatus)
    ) {
      this.validateReHire(
        recordToValidate,
        newEmploymentType,
        newEmploymentStatus,
        dateHired,
        probationPeriodEnd,
      );
      return;
    }

    // Validate transitions based on current employment type
    await this.validateEmploymentTransition(
      recordToValidate,
      newEmploymentType,
      newEmploymentStatus,
      contractStartDate,
      contractEndDate,
    );
  }

  /**
   * Validates that required exit dates and details are provided
   */
  private validateExitDates(
    employmentStatus: EmploymentStatusEnum,
    employmentType: EmploymentTypeEnum,
    resignedDate?: Date,
    terminatedDate?: Date,
    retiredDate?: Date,
    terminationReason?: 'for_cause' | 'without_cause',
  ): void {
    if (employmentStatus === EmploymentStatusEnum.RESIGNED) {
      if (!resignedDate) {
        throw new BadRequestException(
          'resignedDate is required when employmentStatus is RESIGNED',
        );
      }
    }

    if (employmentStatus === EmploymentStatusEnum.TERMINATED) {
      if (!terminatedDate) {
        throw new BadRequestException(
          'terminatedDate is required when employmentStatus is TERMINATED',
        );
      }
      // ✅ Require termination reason
      if (!terminationReason) {
        throw new BadRequestException(
          'terminationReason is required when employmentStatus is TERMINATED. ' +
            'Must be either "for_cause" or "without_cause".',
        );
      }
    }

    if (employmentStatus === EmploymentStatusEnum.RETIRED) {
      if (!retiredDate) {
        throw new BadRequestException(
          'retiredDate is required when employmentStatus is RETIRED',
        );
      }
      if (employmentType !== EmploymentTypeEnum.REGULAR) {
        throw new BadRequestException(
          'RETIRED status is only allowed for Regular employees',
        );
      }
    }
  }

  /**
   * Checks if employee is already in a terminal status (TERMINATED, RESIGNED, RETIRED)
   * Prevents duplicate terminal status records
   */
  private async checkTerminalStatus(
    employeeId: string,
    newEmploymentStatus: EmploymentStatusEnum,
  ): Promise<void> {
    // Only check if trying to create another terminal status record
    const terminalStatuses = [
      EmploymentStatusEnum.TERMINATED,
      EmploymentStatusEnum.RESIGNED,
      EmploymentStatusEnum.RETIRED,
    ];

    if (!terminalStatuses.includes(newEmploymentStatus)) {
      return; // Not a terminal status, skip check
    }

    // Check for existing verified terminal status
    const existingTerminalRecord = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employeeId },
        employmentStatus: Not(EmploymentStatusEnum.ACTIVE),
        isVerified: true,
      },
      order: { createdAt: 'DESC' },
    });

    if (existingTerminalRecord) {
      const statusMap = {
        [EmploymentStatusEnum.TERMINATED]: 'terminated',
        [EmploymentStatusEnum.RESIGNED]: 'resigned',
        [EmploymentStatusEnum.RETIRED]: 'retired',
      };

      const currentStatus =
        statusMap[existingTerminalRecord.employmentStatus] || 'inactive';

      throw new BadRequestException(
        `Employee has already been ${currentStatus} (Record ID: ${existingTerminalRecord.id}). ` +
          `Cannot create duplicate ${statusMap[newEmploymentStatus] || 'exit'} records. `,
      );
    }
  }

  /**
   * Checks for duplicate active job details to prevent double entries
   */
  private async checkForDuplicateActiveJobDetails(
    employeeId: string,
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
  ): Promise<void> {
    // Only check for Active status duplicates
    if (newEmploymentStatus !== EmploymentStatusEnum.ACTIVE) {
      return;
    }

    // Check for unverified pending records first
    const unverifiedPendingRecord = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employeeId },
        employmentStatus: EmploymentStatusEnum.ACTIVE,
        isVerified: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (unverifiedPendingRecord) {
      throw new BadRequestException(
        `Employee has a pending unverified ${unverifiedPendingRecord.employmentType} job detail. ` +
          `Please verify or delete the pending record (ID: ${unverifiedPendingRecord.id}) before creating a new one.`,
      );
    }

    // Check if there's already an active verified job detail for this employee
    const existingActiveJobDetail = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employeeId },
        employmentStatus: EmploymentStatusEnum.ACTIVE,
        isVerified: true,
      },
      order: { createdAt: 'DESC' },
    });

    /** old 
    if (existingActiveJobDetail) {
      // Check if it's the exact same employment type
      if (existingActiveJobDetail.employmentType === newEmploymentType) {
        throw new BadRequestException(
          `Employee already has an active ${newEmploymentType} job detail (ID: ${existingActiveJobDetail.id}). ` +
            `Cannot create duplicate entries. Please update the existing record or terminate it first.`,
        );
      }

      // If different employment type, it means they're trying to transition
      // This will be handled by the transition validation logic
      throw new BadRequestException(
        `Employee already has an active ${existingActiveJobDetail.employmentType} job detail (ID: ${existingActiveJobDetail.id}). ` +
          `You must follow the proper transition workflow. Current status must be resolved before adding new job details.`,
      );
    }
    */

    if (existingActiveJobDetail) {
      const now = new Date();

      // Allow transition from Probation → Regular/Contract if probation ended
      if (
        existingActiveJobDetail.employmentType ===
          EmploymentTypeEnum.PROBATION &&
        newEmploymentType !== EmploymentTypeEnum.PROBATION
      ) {
        if (
          existingActiveJobDetail.probationPeriodEnd &&
          existingActiveJobDetail.probationPeriodEnd <= now
        ) {
          //Probation ended, allow transition
          return;
        } else {
          throw new BadRequestException(
            `Cannot add new job details. Probation period ends on ${existingActiveJobDetail.probationPeriodEnd?.toISOString().split('T')[0]}`,
          );
        }
      }

      if (existingActiveJobDetail.employmentType === newEmploymentType) {
        throw new BadRequestException(
          `Employee already has an active ${newEmploymentType} job detail (ID: ${existingActiveJobDetail.id}). Cannot create duplicate entries.`,
        );
      }

      throw new BadRequestException(
        `Employee already has an active ${existingActiveJobDetail.employmentType} job detail (ID: ${existingActiveJobDetail.id}). Must follow transition workflow.`,
      );
    }
  }

  /**
   * Get pending unverified job details for an employee
   */
  async getPendingUnverifiedJobDetails(
    employeeId: string,
  ): Promise<EmployeeCoreWorkInfo[]> {
    return await this.coreWorkInfoRepository.find({
      where: {
        employee: { id: employeeId },
        isVerified: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Check if employee has any pending unverified records
   */
  async hasPendingUnverifiedRecords(employeeId: string): Promise<boolean> {
    const count = await this.coreWorkInfoRepository.count({
      where: {
        employee: { id: employeeId },
        isVerified: false,
      },
    });
    return count > 0;
  }

  /**
   * Validates first-time employment
   */
  private validateFirstTimeEmployment(
    employmentType: EmploymentTypeEnum,
    employmentStatus: EmploymentStatusEnum,
    dateHired?: Date,
    probationPeriodEnd?: Date,
  ): void {
    // First-time employment must be ACTIVE
    if (employmentStatus !== EmploymentStatusEnum.ACTIVE) {
      throw new BadRequestException(
        `First-time employment must have ACTIVE status. Cannot directly create ${employmentStatus} status for new employees.`,
      );
    }

    // Only certain types are allowed for first-time employment
    const allowedFirstTimeTypes = [
      EmploymentTypeEnum.PROBATION,
      EmploymentTypeEnum.PART_TIME,
      EmploymentTypeEnum.INTERN,
      EmploymentTypeEnum.PROJECT_BASED,
    ];

    if (!allowedFirstTimeTypes.includes(employmentType)) {
      throw new BadRequestException(
        `First-time employment must start with: ${allowedFirstTimeTypes.join(', ')}. Cannot directly hire as ${employmentType}.`,
      );
    }

    if (!dateHired) {
      throw new BadRequestException('dateHired is required for new employees');
    }

    if (
      employmentType === EmploymentTypeEnum.PROBATION &&
      !probationPeriodEnd
    ) {
      throw new BadRequestException(
        'probationPeriodEnd is required for Probation employment type',
      );
    }
  }

  /**
   * Validates re-hiring a previously terminated employee
   */
  private validateReHire(
    previousRecord: EmployeeCoreWorkInfo,
    employmentType: EmploymentTypeEnum,
    employmentStatus: EmploymentStatusEnum,
    dateHired?: Date,
    probationPeriodEnd?: Date,
  ): void {
    // Only TERMINATED employees can be re-hired
    if (previousRecord.employmentStatus === EmploymentStatusEnum.RESIGNED) {
      throw new BadRequestException(
        `Employee has RESIGNED (${previousRecord.resignedDate?.toISOString().split('T')[0]}). ` +
          `Resigned employees cannot be re-hired. Only TERMINATED employees can be re-hired.`,
      );
    }

    if (previousRecord.employmentStatus === EmploymentStatusEnum.RETIRED) {
      throw new BadRequestException(
        `Employee has RETIRED (${previousRecord.retiredDate?.toISOString().split('T')[0]}). ` +
          `Retired employees cannot be re-hired.`,
      );
    }

    // Check termination reason for re-hire eligibility
    if (previousRecord.employmentStatus === EmploymentStatusEnum.TERMINATED) {
      // Both "for_cause" and "without_cause" can be re-hired
      // You can add custom business logic here if needed

      if (previousRecord.terminationReason === 'for_cause') {
        // Optional: Add warning or require special approval
        console.warn(
          `Re-hiring employee terminated for cause. ` +
            `This may require special approval. Previous termination: ${previousRecord.terminationNotes}`,
        );
      }

      // Re-hiring follows same rules as first-time employment
      this.validateFirstTimeEmployment(
        employmentType,
        employmentStatus,
        dateHired,
        probationPeriodEnd,
      );
    }
  }

  /**
   * Validates employment type transitions
   */
  private async validateEmploymentTransition(
    currentJobDetails: EmployeeCoreWorkInfo,
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
    contractStartDate?: Date,
    contractEndDate?: Date,
  ): Promise<void> {
    const currentType = currentJobDetails.employmentType;
    const now = new Date();

    // Allow termination for any employment type without transition validation
    if (
      newEmploymentStatus === EmploymentStatusEnum.TERMINATED &&
      newEmploymentType === currentType
    ) {
      return; // ✅ Valid termination
    }

    switch (currentType) {
      case EmploymentTypeEnum.PROBATION:
        this.validateProbationTransition(
          currentJobDetails,
          newEmploymentType,
          newEmploymentStatus,
          contractStartDate,
          contractEndDate,
          now,
        );
        break;

      case EmploymentTypeEnum.CONTRACT:
        await this.validateContractTransition(
          currentJobDetails,
          newEmploymentType,
          newEmploymentStatus,
          contractStartDate,
          contractEndDate,
        );
        break;

      case EmploymentTypeEnum.REGULAR:
        this.validateRegularTransition(newEmploymentType, newEmploymentStatus);
        break;

      case EmploymentTypeEnum.PART_TIME:
      case EmploymentTypeEnum.INTERN:
      case EmploymentTypeEnum.PROJECT_BASED:
        this.validateNonStandardTransition(
          currentType,
          newEmploymentType,
          newEmploymentStatus,
        );
        break;

      default:
        throw new BadRequestException(
          `Unknown employment type: ${currentType}`,
        );
    }
  }

  /**
   * Validates transitions from Probation status
   */
  private validateProbationTransition(
    currentJobDetails: EmployeeCoreWorkInfo,
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
    dateRegularized?: Date,
    contractStartDate?: Date,
    contractEndDate?: Date,
    // now?: Date,
  ): void {
    const probationEndDate = currentJobDetails.probationPeriodEnd;

    if (!probationEndDate) {
      throw new BadRequestException(
        'Current probation period end date is missing',
      );
    }

    // Allow termination during probation (same employment type)
    if (
      newEmploymentStatus === EmploymentStatusEnum.TERMINATED &&
      newEmploymentType === EmploymentTypeEnum.PROBATION
    ) {
      return; // ✅ Valid termination during probation
    }

    // Check if probation period has ended for transitions
    // if (now && probationEndDate > now) {
    //   throw new BadRequestException(
    //     `Cannot add new job details during probation period. Wait until ${probationEndDate.toISOString().split('T')[0]}`,
    //   );
    // }

    const effectiveDate = dateRegularized || new Date(); // pass dateRegularized from your payload
    if (probationEndDate > effectiveDate) {
      throw new BadRequestException(
        `Cannot add new job details during probation period. Wait until ${probationEndDate.toISOString().split('T')[0]}`,
      );
    }

    // After probation, can only become Contract or Regular
    if (
      ![EmploymentTypeEnum.CONTRACT, EmploymentTypeEnum.REGULAR].includes(
        newEmploymentType,
      )
    ) {
      throw new BadRequestException(
        'After probation, employee can only transition to Contract or Regular employment',
      );
    }

    // Validate Contract requirements
    if (newEmploymentType === EmploymentTypeEnum.CONTRACT) {
      if (!contractStartDate || !contractEndDate) {
        throw new BadRequestException(
          'contractStartDate and contractEndDate are required for Contract employment',
        );
      }

      if (contractStartDate <= probationEndDate) {
        throw new BadRequestException(
          'Contract start date must be after probation period end date',
        );
      }

      if (contractEndDate <= contractStartDate) {
        throw new BadRequestException(
          'Contract end date must be after contract start date',
        );
      }
    }
  }

  /**
   * Validates transitions from Contract status
   */
  private async validateContractTransition(
    currentJobDetails: EmployeeCoreWorkInfo,
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
    contractStartDate?: Date,
    contractEndDate?: Date,
  ): Promise<void> {
    const currentContractEndDate = currentJobDetails.contractEndDate;

    if (!currentContractEndDate) {
      throw new BadRequestException('Current contract end date is missing');
    }

    const now = new Date();

    // Handle termination, resignation, or retirement
    if (
      [
        EmploymentStatusEnum.TERMINATED,
        EmploymentStatusEnum.RESIGNED,
        EmploymentStatusEnum.RETIRED,
      ].includes(newEmploymentStatus)
    ) {
      // Can only resign from active contracts
      if (newEmploymentStatus === EmploymentStatusEnum.RESIGNED) {
        if (now < currentContractEndDate) {
          // Allow resignation during active contract
          return;
        }
        throw new BadRequestException(
          `Contract already ended on ${currentContractEndDate.toISOString().split('T')[0]}. Use TERMINATED status instead.`,
        );
      }

      // Retired is not allowed for contract employees
      if (newEmploymentStatus === EmploymentStatusEnum.RETIRED) {
        throw new BadRequestException(
          'RETIRED status is only for Regular employees. Contract employees should use RESIGNED or TERMINATED.',
        );
      }

      // For TERMINATED
      if (now < currentContractEndDate) {
        throw new BadRequestException(
          `Contract is still active until ${currentContractEndDate.toISOString().split('T')[0]}. Use RESIGNED if employee is leaving voluntarily.`,
        );
      }
      return; // Valid termination
    }

    // Handle contract renewal
    if (newEmploymentType === EmploymentTypeEnum.CONTRACT) {
      if (!contractStartDate || !contractEndDate) {
        throw new BadRequestException(
          'contractStartDate and contractEndDate are required for contract renewal',
        );
      }

      // Validate new contract dates
      if (contractEndDate <= contractStartDate) {
        throw new BadRequestException(
          'Contract end date must be after contract start date',
        );
      }

      // New contract should start after current contract ends (or on the same day)
      if (contractStartDate < currentContractEndDate) {
        throw new BadRequestException(
          `New contract start date must be on or after current contract end date (${currentContractEndDate.toISOString().split('T')[0]})`,
        );
      }

      // Check for overlapping contracts with same dates
      await this.checkForOverlappingContracts(
        currentJobDetails.employee.id,
        contractStartDate,
        contractEndDate,
        currentJobDetails.id,
      );

      return; // Valid contract renewal
    }

    // Cannot transition to other employment types from Contract
    throw new BadRequestException(
      'Contract employees can only renew their contract, resign, or be terminated. Cannot change to other employment types.',
    );
  }

  /**
   * Check for overlapping or duplicate contract periods
   */
  private async checkForOverlappingContracts(
    employeeId: string,
    newStartDate: Date,
    newEndDate: Date,
    excludeRecordId?: string,
  ): Promise<void> {
    const overlappingContracts = await this.coreWorkInfoRepository
      .createQueryBuilder('contract')
      .where('contract.employee_id = :employeeId', { employeeId })
      .andWhere('contract.employment_type = :type', {
        type: EmploymentTypeEnum.CONTRACT,
      })
      .andWhere('contract.id != :excludeId', {
        excludeId: excludeRecordId || '',
      })
      .andWhere(
        '(contract.contract_start_date, contract.contract_end_date) OVERLAPS (:newStart, :newEnd)',
        {
          newStart: newStartDate,
          newEnd: newEndDate,
        },
      )
      .getMany();

    if (overlappingContracts.length > 0) {
      const existing = overlappingContracts[0];
      throw new BadRequestException(
        `Contract period overlaps with existing contract (${existing.contractStartDate?.toISOString().split('T')[0]} to ${existing.contractEndDate?.toISOString().split('T')[0]}). ` +
          `Contract periods cannot overlap.`,
      );
    }

    // Also check for exact duplicate dates
    const duplicateContract = await this.coreWorkInfoRepository.findOne({
      where: {
        employee: { id: employeeId },
        employmentType: EmploymentTypeEnum.CONTRACT,
        contractStartDate: newStartDate,
        contractEndDate: newEndDate,
        id: excludeRecordId ? Not(excludeRecordId) : undefined,
      },
    });

    if (duplicateContract) {
      throw new BadRequestException(
        `A contract with the same start and end dates already exists. Cannot create duplicate contract periods.`,
      );
    }
  }

  /**
   * Validates transitions from Regular status
   */
  private validateRegularTransition(
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
  ): void {
    // Regular employees can be resigned, retired, or terminated
    if (
      [
        EmploymentStatusEnum.RESIGNED,
        EmploymentStatusEnum.RETIRED,
        EmploymentStatusEnum.TERMINATED,
      ].includes(newEmploymentStatus)
    ) {
      return; // Valid exit status
    }

    if (newEmploymentType !== EmploymentTypeEnum.REGULAR) {
      throw new BadRequestException(
        'Regular employees can only continue as Regular or exit (RESIGNED/RETIRED/TERMINATED). Cannot change to other employment types.',
      );
    }
  }

  /**
   * Validates transitions from Part-Time, Intern, or Project-Based
   */
  private validateNonStandardTransition(
    currentType: EmploymentTypeEnum,
    newEmploymentType: EmploymentTypeEnum,
    newEmploymentStatus: EmploymentStatusEnum,
  ): void {
    if (
      newEmploymentStatus === EmploymentStatusEnum.TERMINATED &&
      newEmploymentType === currentType
    ) {
      return;
    }

    throw new BadRequestException(
      `${currentType} employees cannot transition to other employment types unless terminated and re-hired. ` +
        `Additional job details are optional only if company decides to re-hire them.`,
    );
  }
}
