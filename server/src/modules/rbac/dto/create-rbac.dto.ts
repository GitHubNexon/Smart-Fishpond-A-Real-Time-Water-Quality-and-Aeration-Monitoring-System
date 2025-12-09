import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAccessDto {
  @IsString()
  @IsNotEmpty()
  access: string;

  @IsString()
  description: string;
}

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  permission: string;

  @IsString()
  description: string;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  description: string;
}
