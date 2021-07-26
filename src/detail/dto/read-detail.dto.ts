import { Expose } from "class-transformer";

export class ReadDetailDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  subtotal: number;

  @Expose()
  quantity: number;

}