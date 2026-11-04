import { IsInt, IsNotEmpty, IsUUID, Min } from "class-validator";

export class CreateOrdersItemDto {
    // relasi ke orders (many to one)
    @IsNotEmpty({message: 'Order harus diisi'})
    @IsUUID('all', {message: 'orderId harus berupa UUID'})
    readonly orderId: string;

    // relasi ke books (many to one)
    @IsNotEmpty({message: 'Book harus diisi'})
    @IsUUID('all', {message: 'bookId harus berupa UUID'})
    readonly bookId: string;

    @IsNotEmpty({message: 'Jumlah harus diisi'})
    @IsInt({message: 'Jumlah harus berupa angka bulat'})
    @Min(1, {message: 'Jumlah minimal 1'})
    readonly quantity: number;
}