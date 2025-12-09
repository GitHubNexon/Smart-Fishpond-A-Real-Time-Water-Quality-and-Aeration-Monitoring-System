import { IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateRoleDto {
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePermissionDto {
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  description?: string;
}
