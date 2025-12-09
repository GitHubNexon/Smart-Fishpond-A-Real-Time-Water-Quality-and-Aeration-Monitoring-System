import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSmDto {
  @IsNotEmpty()
  @IsString()
  to: string; // recipient phone number, e.g. "+639123456789"

  @IsNotEmpty()
  @IsString()
  text: string; // message content
}
