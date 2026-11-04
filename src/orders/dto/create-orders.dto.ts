import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsUUID, Min, ValidateNested } from "class-validator";

export class CreateOrderItemDto {
    // relasi ke books (many to one)
    @IsNotEmpty({message: 'Book harus diisi'})
    @IsUUID('all', {message: 'bookId harus berupa UUID'})
    readonly bookId: string;

    @IsNotEmpty({message: 'Jumlah harus diisi'})
    @IsInt({message: 'Jumlah harus berupa angka bulat'})
    @Min(1, {message: 'Jumlah minimal 1'})
    readonly quantity: number;
}

export class CreateOrderDto {
    // relasi ke customers (many to one)
    @IsNotEmpty({message: 'Customer harus diisi'})
    @IsUUID('all', {message: 'customerId harus berupa UUID'})
    readonly customerId: string;

    // relasi ke order_items (one to many)
    @IsArray({message: 'items harus berupa array'})
    @ArrayMinSize(1, {message: 'Minimal 1 buku dalam pesanan'})
    @ValidateNested({each: true})
    @Type(() => CreateOrderItemDto)
    readonly items: CreateOrderItemDto[];
}