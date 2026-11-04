import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateBookAuthorDto {
    // relasi ke books (many to one)
    @IsNotEmpty({message: 'Book harus diisi'})
    @IsUUID('all', {message: 'bookId harus berupa UUID'})
    readonly bookId: string;

    // relasi ke authors (many to one)
    @IsNotEmpty({message: 'Author harus diisi'})
    @IsUUID('all', {message: 'authorId harus berupa UUID'})
    readonly authorId: string;
}