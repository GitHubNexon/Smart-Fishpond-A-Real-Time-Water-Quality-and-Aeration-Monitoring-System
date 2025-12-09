//src/modules/rbac/dto/create-permission.dto.ts
import {IsString, IsNotEmpty} from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    permission: string;

     @IsString()
    description: string;
}