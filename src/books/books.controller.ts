import { Controller, Get , Post , Put} from '@nestjs/common';

@Controller('books')
export class BooksController {
    //menampilkan data 
    @Get()
    findAll(): string {
        return 'Menampilkan semua data buku';
    }

    //menyimpan data
    @Post()
    SimpanData(): string {
        return 'Menyimpan data buku';
    }

    //mengupdate data
    @Put(':id')
    update(): string {
        return 'Mengupdate data buku';
    }

    //menghapus data
}
