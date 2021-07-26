import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

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
  @IsOptional()
  identification: string;

  @IsString()
  @IsOptional()
  image: string;
}