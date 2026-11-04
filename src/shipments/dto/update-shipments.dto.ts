import { IsIn, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class UpdateShipmentStatusDto {
    @IsNotEmpty({message: 'Status harus diisi'})
    @IsIn(['shipped', 'delivered'], {
        message: 'Status harus salah satu dari: shipped, delivered'
    })
    readonly status: string;

    @IsOptional()
    @MaxLength(100, {message: 'Nomor resi maksimal 100 karakter'})
    readonly trackingNumber?: string;
}