import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  state: string;

  @IsNumber()
  @IsNotEmpty()
  employeeId: number;
}
