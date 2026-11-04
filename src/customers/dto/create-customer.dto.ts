import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateCustomerDto {
    @IsNotEmpty({message: 'Nama harus diisi'})
    @MaxLength(150, {message: 'Nama maksimal 150 karakter'})
    readonly name: string;

    @IsNotEmpty({message: 'Email harus diisi'})
    @IsEmail({}, {message: 'Format email tidak valid'})
    @MaxLength(150, {message: 'Email maksimal 150 karakter'})
    readonly email: string;

    @IsOptional()
    @MaxLength(20, {message: 'Nomor telepon maksimal 20 karakter'})
    readonly phone?: string;
}