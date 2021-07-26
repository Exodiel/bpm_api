import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateDetailDto {
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @IsNumber()
    @IsNotEmpty()
    subtotal: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @IsNumber()
    @IsNotEmpty()
    productId: number;
}