import { IsInt, IsNotEmpty} from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({message: 'Title harus diisi'})
    readonly title: string;

    @IsNotEmpty({message: 'Author harus diisi'})
    readonly author: string;

    @IsNotEmpty({message: 'ISBN harus diisi'})
    readonly isbn: string;

    @IsNotEmpty({message: 'Tahun terbit harus diisi'})
    @IsInt({message: 'Published year harus berupa angka'})
    readonly publishedYear: number;
}