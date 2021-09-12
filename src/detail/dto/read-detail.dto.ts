import { Expose } from 'class-transformer';
import { ReadProductDto } from '../../product/dto/read-product.dto';

export class ReadDetailDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  discountvalue: number;

  @Expose()
  subtotal: number;

  @Expose()
  quantity: number;

  @Expose()
  product: ReadProductDto;
}
