import { Expose } from 'class-transformer';
import { ReadOrderDto } from '../../order/dto/read-order.dto';

export class ReadNotificationDTO {
  @Expose()
  readonly id: number;

  @Expose()
  readonly topic: string;

  @Expose()
  readonly title: string;

  @Expose()
  readonly body: string;

  @Expose()
  readonly imageUrl: string;

  @Expose()
  readonly created_at: string;

  @Expose()
  readonly updated_at: string;

  @Expose()
  readonly order: ReadOrderDto;
}
