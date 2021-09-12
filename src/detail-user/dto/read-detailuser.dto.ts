import { Expose } from 'class-transformer';
import { ReadOrderDto } from '../../order/dto/read-order.dto';
import { ReadUserDto } from '../../user/dto/read-user.dto';

export class ReadDetailUserDTO {
  @Expose()
  id: number;

  @Expose()
  cause: string;

  @Expose()
  description: string;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string;

  @Expose()
  user: ReadUserDto;

  @Expose()
  order: ReadOrderDto;
}
