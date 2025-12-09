import { Type } from '@nestjs/common';
import { CreateCompanyProfileDto, SupplierDto } from './create-system.dto';
import { PartialType, IntersectionType } from '@nestjs/swagger';

export class UpdateSystemDto extends PartialType(
  IntersectionType(CreateCompanyProfileDto, SupplierDto),
) {}
