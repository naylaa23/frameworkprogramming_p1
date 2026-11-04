import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateAuthorDto {
    @IsNotEmpty({message: 'Nama penulis harus diisi'})
    @MaxLength(150, {message: 'Nama penulis maksimal 150 karakter'})
    readonly name: string;
}