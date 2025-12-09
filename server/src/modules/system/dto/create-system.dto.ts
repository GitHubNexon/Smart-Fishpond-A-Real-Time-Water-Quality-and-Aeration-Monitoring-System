import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCompanyProfileDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsOptional()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  taxNumber: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  logoUrl: string;

  @IsString()
  @IsOptional()
  website: string;
}

export class SupplierDto {
  @IsString()
  @IsOptional()
  supplierName: string;

  @IsString()
  @IsOptional()
  supplierContactNo: string;

  @IsString()
  @IsOptional()
  supplierCosupplierContactEmailntactNo: string;
}
