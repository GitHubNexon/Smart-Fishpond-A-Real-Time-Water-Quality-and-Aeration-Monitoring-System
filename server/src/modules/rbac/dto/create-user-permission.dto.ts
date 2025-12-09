// src/modules/rbac/dto/create-user-permission.dto.ts
import { IsUUID, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateUserPermissionDto {
  @IsUUID()
  userId: string;

  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}
