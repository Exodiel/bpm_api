import { Expose } from 'class-transformer';
import { ReadCategoryDto } from '../../category/dto/read-category.dto';

export class ReadProductDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly cost: number;

  @Expose()
  readonly price: number;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly image: string;

  @Expose()
  readonly category: ReadCategoryDto;
}
