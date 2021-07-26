import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}