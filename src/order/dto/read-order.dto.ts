import { Expose } from 'class-transformer';
import { ReadDetailDto } from '../../detail/dto/read-detail.dto';
import { ReadUserDto } from '../../user/dto/read-user.dto';

export class ReadOrderDto {
  @Expose()
  id: number;

  @Expose()
  sequential: string;

  @Expose()
  date: string;

  @Expose()
  discount: number;

  @Expose()
  subtotal: number;

  @Expose()
  tax: number;

  @Expose()
  total: number;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  payment: string;

  @Expose()
  state: string;

  @Expose()
  address: string;

  @Expose()
  origin: string;

  @Expose()
  user: ReadUserDto;

  @Expose()
  person: ReadUserDto;

  @Expose()
  details: ReadDetailDto[];
}
