import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateNotificationDTO {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsString()
  @IsOptional()
  data: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}
