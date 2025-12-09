//src/modules/rbac/dto/create-role.dto.ts
import {IsString, IsNotEmpty} from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    description: string;
}
