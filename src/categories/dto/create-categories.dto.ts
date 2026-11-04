import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({message: 'Nama kategori harus diisi'})
    @MaxLength(65, {message: 'Nama kategori maksimal 65 karakter'})
    readonly nama: string;
}