import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsArray,
  IsUUID,
  Validate,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
  PayFrequencyEnum,
  WorkScheduleEnum,
} from '../enums/employee.enum';
import {
  IsProbationPeriodValid,
  IsProbationPeriodValidConstraint,
  IsContractDatesValid,
  IsContractDatesValidConstraint,
  IsRegularizationDateValid,
  IsRegularizationDateValidConstraint,
  IsContractEndDateAfterStartDate,
  IsContractEndDateAfterStartDateConstraint,
  IsResignedDateValid,
  IsResignedDateValidConstraint,
  IsRetiredDateValid,
  IsRetiredDateValidConstraint,
} from '../validators/employement.validators';

export class CreateEmployeeJobDetailsDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  employee: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsEnum(EmploymentTypeEnum)
  @IsNotEmpty()
  @Validate(IsProbationPeriodValidConstraint)
  @Validate(IsContractDatesValidConstraint)
  @Validate(IsRegularizationDateValidConstraint)
  employmentType: EmploymentTypeEnum;

  @IsEnum(EmploymentStatusEnum)
  @IsNotEmpty()
  @Validate(IsResignedDateValidConstraint)
  @Validate(IsRetiredDateValidConstraint)
  employmentStatus: EmploymentStatusEnum;

  @IsOptional()
  @IsDateString()
  dateHired?: Date;

  @IsOptional()
  @IsDateString()
  dateRegularized?: Date;

  @IsOptional()
  @IsDateString()
  @Validate(IsContractEndDateAfterStartDateConstraint)
  contractStartDate?: Date;

  @IsOptional()
  @IsDateString()
  @Validate(IsContractEndDateAfterStartDateConstraint)
  contractEndDate?: Date;

  @IsOptional()
  @IsDateString()
  probationPeriodEnd?: Date;

  // Exit Dates
  @IsOptional()
  @IsDateString()
  resignedDate?: Date;

  @IsOptional()
  @IsDateString()
  terminatedDate?: Date;

  @IsOptional()
  @IsDateString()
  retiredDate?: Date;

  // Termination Reason - MUST come BEFORE terminatedDate validation
  @IsOptional()
  @IsEnum(['for_cause', 'without_cause'], {
    message: 'terminationReason must be either "for_cause" or "without_cause"',
  })
  terminationReason?: 'for_cause' | 'without_cause';

  @IsOptional()
  @IsString()
  terminationNotes?: string;

  // Resignation details
  @IsOptional()
  @IsString()
  resignationReason?: string;

  @IsOptional()
  @IsString()
  resignationNotes?: string;

  // Retirement details
  @IsOptional()
  @IsString()
  retirementNotes?: string;
}
