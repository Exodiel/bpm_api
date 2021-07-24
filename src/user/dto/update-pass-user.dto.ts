import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePassUserDto {

    @IsString()
    @IsNotEmpty()
    readonly password: string;

}