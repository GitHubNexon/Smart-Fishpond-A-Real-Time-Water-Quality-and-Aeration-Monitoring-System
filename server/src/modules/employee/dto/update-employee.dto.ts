import { PartialType, OmitType } from '@nestjs/swagger';
import {
  CreateEmployeeDto,
  CreateEmployeePersonalInfoDto,
  CreateEmployeeContactInfoDto,
  CreateEmployeeAddressInfoDto,
  CreateEmployeeGovernmentInfoDto,
  CreateEmployeeFamilyInfoDto,
  CreateEmployeeEducationalInfoDto,
  CreateEmployeeWorkExperienceInfoDto,
} from './create-employee.dto';
import { ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// Make all nested DTOs partial for updates
export class UpdateEmployeePersonalInfoDto extends PartialType(
  CreateEmployeePersonalInfoDto,
) {}

export class UpdateEmployeeContactInfoDto extends PartialType(
  CreateEmployeeContactInfoDto,
) {}

export class UpdateEmployeeAddressInfoDto extends PartialType(
  CreateEmployeeAddressInfoDto,
) {}

export class UpdateEmployeeGovernmentInfoDto extends PartialType(
  CreateEmployeeGovernmentInfoDto,
) {}

export class UpdateEmployeeFamilyInfoDto extends PartialType(
  CreateEmployeeFamilyInfoDto,
) {}

export class UpdateEmployeeEducationalInfoDto extends PartialType(
  CreateEmployeeEducationalInfoDto,
) {}

export class UpdateEmployeeWorkExperienceInfoDto extends PartialType(
  CreateEmployeeWorkExperienceInfoDto,
) {}

// Main Update DTO - don't extend, define independently to avoid type conflicts
export class UpdateEmployeeDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeePersonalInfoDto)
  personalInfo?: UpdateEmployeePersonalInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeContactInfoDto)
  contactInfo?: UpdateEmployeeContactInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeAddressInfoDto)
  addressInfo?: UpdateEmployeeAddressInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeGovernmentInfoDto)
  governmentInfo?: UpdateEmployeeGovernmentInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeFamilyInfoDto)
  familyInfo?: UpdateEmployeeFamilyInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeEducationalInfoDto)
  educationalInfo?: UpdateEmployeeEducationalInfoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEmployeeWorkExperienceInfoDto)
  workExperienceInfo?: UpdateEmployeeWorkExperienceInfoDto[];
}
