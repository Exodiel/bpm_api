import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  rol: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  identification_type: string;

  @IsNumber()
  @IsOptional()
  active: number;

  @IsString()
  @IsOptional()
  identification: string;

  @IsString()
  @IsOptional()
  image: string;
}
