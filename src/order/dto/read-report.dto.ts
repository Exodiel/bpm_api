import { Expose } from 'class-transformer';

export class ReadReportDto {
  @Expose()
  total: number;

  @Expose()
  month: number;

  @Expose()
  count: number;
}
