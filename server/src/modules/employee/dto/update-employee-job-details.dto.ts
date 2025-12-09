import { PartialType, OmitType } from '@nestjs/swagger';
import { ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmployeeJobDetailsDto } from './create-employee-job-details.dto';

export class UpdateEmployeeJobDetailsDto extends PartialType(
  CreateEmployeeJobDetailsDto,
) {}
