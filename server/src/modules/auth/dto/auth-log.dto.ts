import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAuthLogDto {
  @ApiProperty({ description: 'User ID who logged in' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'IP address of the user', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'Device info (e.g. browser, OS)',
    required: false,
  })
  @IsOptional()
  @IsString()
  device?: string;
}
