import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({message: 'Title harus diisi'})
    readonly title: string;

    @IsNotEmpty({message: 'ISBN harus diisi'})
    readonly isbn: string;

    @IsNotEmpty({message: 'Tahun terbit harus diisi'})
    @IsInt({message: 'Published year harus berupa angka'})
    readonly publishedYear: number;

    @IsOptional()
    @IsBoolean({message: 'isAvailable harus berupa true atau false'})
    readonly isAvailable?: boolean;

    @IsNotEmpty({message: 'Harga harus diisi'})
    @IsNumber({}, {message: 'Harga harus berupa angka'})
    @Min(0, {message: 'Harga tidak boleh negatif'})
    readonly price: number;

    @IsNotEmpty({message: 'Stok harus diisi'})
    @IsInt({message: 'Stok harus berupa angka bulat'})
    @Min(0, {message: 'Stok tidak boleh negatif'})
    readonly stock: number;

    // relasi ke categories (many to one)
    @IsNotEmpty({message: 'Category harus diisi'})
    @IsUUID('all', {message: 'categoryId harus berupa UUID'})
    readonly categoryId: string;

    // relasi ke publishers (many to one)
    @IsNotEmpty({message: 'Publisher harus diisi'})
    @IsUUID('all', {message: 'publisherId harus berupa UUID'})
    readonly publisherId: string;

    // relasi ke authors lewat book_authors (many to many)
    @IsArray({message: 'authorIds harus berupa array'})
    @IsUUID('all', {each: true, message: 'Setiap authorIds harus berupa UUID'})
    readonly authorIds: string[];
}