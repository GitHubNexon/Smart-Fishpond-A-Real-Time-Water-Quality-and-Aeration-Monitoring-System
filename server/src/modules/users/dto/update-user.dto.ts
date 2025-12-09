//src/modules/users/dto/update-user.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
  IsDate,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  username?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  passKey: string;

  @IsString()
  access?: string[];

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  roleId: string;

  @IsUUID()
  @IsOptional()
  employeeId: string | null;

}
