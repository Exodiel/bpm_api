import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDetailUserDTO {
  @IsString()
  @IsNotEmpty()
  cause: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
