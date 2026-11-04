import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthor } from './entities/book_authors.entity.js';
import { Book } from '../books/entitas/book-entity.js';
import { Author } from '../authors/entities/authors.entity.js';
import { CreateBookAuthorDto } from './dto/create-book_authors.dto.js';

@Injectable()
export class BookAuthorsService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(BookAuthor)
        private readonly bookAuthorRepository: Repository<BookAuthor>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,

        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>
    ){}

    //logic untuk mendapatkan semua relasi buku dan penulis
    async findAll(): Promise<BookAuthor[]> {
        return await this.bookAuthorRepository.find({
            relations: { book: true, author: true }
        })
    }

    //simpan data
    async simpanData(createBookAuthorDto: CreateBookAuthorDto): Promise<BookAuthor>{
        const { bookId, authorId } = createBookAuthorDto;

        //pastikan buku dan penulis ada
        const book = await this.bookRepository.findOneBy({ id: bookId })
        if(!book){
            throw new NotFoundException(`Buku ${bookId} tidak di temukan`)
        }
        const author = await this.authorRepository.findOneBy({ id: authorId })
        if(!author){
            throw new NotFoundException(`Penulis ${authorId} tidak di temukan`)
        }

        //pasangan yang sama tidak boleh dobel
        const sudahAda = await this.bookAuthorRepository.findOneBy({ bookId, authorId })
        if(sudahAda){
            throw new ConflictException('Penulis sudah terhubung dengan buku ini')
        }

        const newBookAuthor = this.bookAuthorRepository.create({ bookId, authorId });
        await this.bookAuthorRepository.save(newBookAuthor);

        return await this.findOne(bookId, authorId)
    }

    // menampilkan data berdasarkan bookId dan authorId
    async findOne(bookId: string, authorId: string): Promise<BookAuthor>{
        const bookAuthor = await this.bookAuthorRepository.findOne({
            where: { bookId, authorId },
            relations: { book: true, author: true }
        })

        //jika tidak ada
        if(!bookAuthor){
            throw new NotFoundException('Relasi buku dan penulis tidak di temukan')
        }
        //jika data di temukan
        return bookAuthor
    }

    //menghapus data (dihapus permanen)
    async deleteData(bookId: string, authorId: string): Promise<{message: string}>{
        await this.findOne(bookId, authorId)

        await this.bookAuthorRepository.delete({ bookId, authorId })

        return {
            message: `Relasi buku ${bookId} dan penulis ${authorId} berhasil dihapus`
        }
    }
}