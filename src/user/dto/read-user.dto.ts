import { Expose } from 'class-transformer';

export class ReadUserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly username: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly type: string;

  @Expose()
  readonly identification_type: string;

  @Expose()
  readonly active: number;

  @Expose()
  readonly rol: string;

  @Expose()
  readonly phone: string;

  @Expose()
  readonly address: string;

  @Expose()
  readonly identification: string;

  @Expose()
  readonly image: string;

  @Expose()
  readonly state: string;
}
