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
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  GenderEnum,
  CivilStatusEnum,
  BloodTypeEnum,
} from '../enums/employee.enum';

// Personal Info DTO
export class CreateEmployeePersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @IsEnum(CivilStatusEnum)
  @IsNotEmpty()
  civilStatus: CivilStatusEnum;

  @IsEnum(BloodTypeEnum)
  @IsNotEmpty()
  bloodType: BloodTypeEnum;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsString()
  @IsNotEmpty()
  citizenship: string;
}

// Contact Info DTO
export class CreateEmployeeContactInfoDto {
  @IsOptional()
  @IsString()
  contactNo?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  contactEmail?: string;

  @IsOptional()
  @IsString()
  emergencyContactNo?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyRelationship?: string;
}

// Address Info DTO
export class CreateEmployeeAddressInfoDto {
  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  barangay?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  region?: string;
}

// Government Info DTO
export class CreateEmployeeGovernmentInfoDto {
  @IsOptional()
  @IsString()
  sss?: string;

  @IsOptional()
  @IsString()
  pagIbig?: string;

  @IsOptional()
  @IsString()
  philHealth?: string;

  @IsOptional()
  @IsString()
  tin?: string;

  @IsOptional()
  @IsString()
  passportNo?: string;

  @IsOptional()
  @IsString()
  driversLicense?: string;

  @IsOptional()
  @IsString()
  postalId?: string;

  @IsOptional()
  @IsString()
  votersId?: string;

  @IsOptional()
  @IsString()
  nbi?: string;

  @IsOptional()
  @IsString()
  policeClearance?: string;
}

// Children Info DTO
export class CreateEmployeeChildrenInfoDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  suffix?: string;
}

// Family Info DTO
export class CreateEmployeeFamilyInfoDto {
  @IsOptional()
  @IsString()
  spouseFirstName?: string;

  @IsOptional()
  @IsString()
  spouseMiddleName?: string;

  @IsOptional()
  @IsString()
  spouseLastName?: string;

  @IsOptional()
  @IsString()
  spouseSuffix?: string;

  @IsString()
  @IsNotEmpty()
  fatherFirstName: string;

  @IsOptional()
  @IsString()
  fatherMiddleName?: string;

  @IsString()
  @IsNotEmpty()
  fatherLastName: string;

  @IsOptional()
  @IsString()
  fatherSuffix?: string;

  @IsString()
  @IsNotEmpty()
  motherFirstName: string;

  @IsOptional()
  @IsString()
  motherMiddleName?: string;

  @IsString()
  @IsNotEmpty()
  motherLastName: string;

  @IsOptional()
  @IsString()
  motherMaidenName?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeChildrenInfoDto)
  children?: CreateEmployeeChildrenInfoDto[];
}

// Educational Info DTO
export class CreateEmployeeEducationalInfoDto {
  @IsOptional()
  @IsString()
  elementary?: string;

  @IsOptional()
  @IsString()
  elementarySchoolName?: string;

  @IsOptional()
  @IsString()
  elementaryYearGraduated?: string;

  @IsOptional()
  @IsString()
  highSchool?: string;

  @IsOptional()
  @IsString()
  highSchoolName?: string;

  @IsOptional()
  @IsString()
  highSchoolYearGraduated?: string;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  collegeSchoolName?: string;

  @IsOptional()
  @IsString()
  collegeYearGraduated?: string;

  @IsOptional()
  @IsString()
  collegeCourse?: string;

  @IsOptional()
  @IsString()
  masters?: string;

  @IsOptional()
  @IsString()
  mastersSchoolName?: string;

  @IsOptional()
  @IsString()
  mastersYearGraduated?: string;

  @IsOptional()
  @IsString()
  mastersCourse?: string;

  @IsOptional()
  @IsString()
  phd?: string;

  @IsOptional()
  @IsString()
  phdSchoolName?: string;

  @IsOptional()
  @IsString()
  phdYearGraduated?: string;

  @IsOptional()
  @IsString()
  phdCourse?: string;
}

// Work Experience Info DTO
export class CreateEmployeeWorkExperienceInfoDto {
  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  toDate?: Date;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;
}

// Main Create Employee DTO
export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ValidateNested()
  @Type(() => CreateEmployeePersonalInfoDto)
  @IsNotEmpty()
  personalInfo: CreateEmployeePersonalInfoDto;

  @ValidateNested()
  @Type(() => CreateEmployeeContactInfoDto)
  @IsOptional()
  contactInfo?: CreateEmployeeContactInfoDto;

  @ValidateNested()
  @Type(() => CreateEmployeeAddressInfoDto)
  @IsOptional()
  addressInfo?: CreateEmployeeAddressInfoDto;

  @ValidateNested()
  @Type(() => CreateEmployeeGovernmentInfoDto)
  @IsOptional()
  governmentInfo?: CreateEmployeeGovernmentInfoDto;

  @ValidateNested()
  @Type(() => CreateEmployeeFamilyInfoDto)
  @IsOptional()
  familyInfo?: CreateEmployeeFamilyInfoDto;

  @ValidateNested()
  @Type(() => CreateEmployeeEducationalInfoDto)
  @IsOptional()
  educationalInfo?: CreateEmployeeEducationalInfoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeWorkExperienceInfoDto)
  workExperienceInfo?: CreateEmployeeWorkExperienceInfoDto[];
}
