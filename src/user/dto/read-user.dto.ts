import { Exclude, Expose } from 'class-transformer';

export class ReadUserDto {

    @Expose()
    readonly id: number;

    @Expose()
    readonly name: string;

    @Expose()
    readonly password: string;

    @Expose()
    readonly username: string;

    @Expose()
    readonly email: string;

    @Expose()
    readonly rol: string;

    @Expose()
    readonly identification: string;

    @Expose()
    readonly image: string;
}