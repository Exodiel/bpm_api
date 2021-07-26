import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  payment: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}