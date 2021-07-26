import { Expose } from "class-transformer";

export class ReadCategoryDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;
}
