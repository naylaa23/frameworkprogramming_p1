import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from "class-validator";

export class CreateShipmentDto {
    // relasi ke orders (one to one)
    @IsNotEmpty({message: 'Order harus diisi'})
    @IsUUID('all', {message: 'orderId harus berupa UUID'})
    readonly orderId: string;

    @IsNotEmpty({message: 'Kurir harus diisi'})
    @MaxLength(100, {message: 'Kurir maksimal 100 karakter'})
    readonly courier: string;

    @IsOptional()
    @MaxLength(100, {message: 'Nomor resi maksimal 100 karakter'})
    readonly trackingNumber?: string;
}