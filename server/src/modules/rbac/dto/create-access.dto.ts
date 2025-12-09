//src/modules/rbac/dto/create-access.dto.ts
import { IsString, IsNotEmpty } from "class-validator";

export class CreateAccessDto {
    @IsString()
    @IsNotEmpty()
    access: string;

    @IsString()
    description: string;
}