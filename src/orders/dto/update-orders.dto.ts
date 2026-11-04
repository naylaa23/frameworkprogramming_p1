import { IsIn, IsNotEmpty } from "class-validator";

export class UpdateOrderStatusDto {
    @IsNotEmpty({message: 'Status harus diisi'})
    @IsIn(['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'], {
        message: 'Status harus salah satu dari: pending, paid, processing, shipped, completed, cancelled'
    })
    readonly status: string;
}