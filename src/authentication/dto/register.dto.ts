import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
