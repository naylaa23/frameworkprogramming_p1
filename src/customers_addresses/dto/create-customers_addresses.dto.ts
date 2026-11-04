import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class CreateCustomerAddressDto {
    // relasi ke customers (many to one)
    @IsNotEmpty({message: 'Customer harus diisi'})
    @IsUUID('all', {message: 'customerId harus berupa UUID'})
    readonly customerId: string;

    @IsNotEmpty({message: 'Nama penerima harus diisi'})
    @MaxLength(150, {message: 'Nama penerima maksimal 150 karakter'})
    readonly recipientName: string;

    @IsNotEmpty({message: 'Nomor telepon harus diisi'})
    @MaxLength(20, {message: 'Nomor telepon maksimal 20 karakter'})
    readonly phone: string;

    @IsNotEmpty({message: 'Alamat harus diisi'})
    readonly address: string;

    @IsNotEmpty({message: 'Kota harus diisi'})
    @MaxLength(100, {message: 'Kota maksimal 100 karakter'})
    readonly city: string;

    @IsNotEmpty({message: 'Kode pos harus diisi'})
    @MaxLength(10, {message: 'Kode pos maksimal 10 karakter'})
    readonly postalCode: string;
}