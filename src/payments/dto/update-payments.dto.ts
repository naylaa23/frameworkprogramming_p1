import { IsIn, IsNotEmpty } from "class-validator";

export class UpdatePaymentStatusDto {
    @IsNotEmpty({message: 'Status harus diisi'})
    @IsIn(['pending', 'paid', 'failed'], {
        message: 'Status harus salah satu dari: pending, paid, failed'
    })
    readonly status: string;
}