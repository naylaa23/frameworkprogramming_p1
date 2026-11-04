import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class CreatePaymentDto {
    // relasi ke orders (one to one)
    @IsNotEmpty({message: 'Order harus diisi'})
    @IsUUID('all', {message: 'orderId harus berupa UUID'})
    readonly orderId: string;

    @IsNotEmpty({message: 'Metode pembayaran harus diisi'})
    @MaxLength(50, {message: 'Metode pembayaran maksimal 50 karakter'})
    readonly paymentMethod: string;
}