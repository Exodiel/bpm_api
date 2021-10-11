import { Expose } from 'class-transformer';

export class ReadProductReportDto {
  @Expose()
  readonly product_name: string;

  @Expose()
  readonly product_cost: string;

  @Expose()
  readonly product_price: string;

  @Expose()
  readonly product_stock: number;

  @Expose()
  readonly total: string;
}
