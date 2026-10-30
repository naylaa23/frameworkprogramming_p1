import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entitas/book-entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ){}

    //logic untuk mendapatkan semua buku
    async findAll(): Promise<Book[]> {
        //select * from book
        return await this.bookRepository.find({
            order:{createdAt:'DESC'}
        })
    }

    //simpan data 
    async simpanData(createBookDto: CreateBookDto): Promise<Book>{
        const newBook = this.bookRepository.create(createBookDto);

        return await this.bookRepository.save(newBook);
    }
    // menampilkan data berdasarkan id
    async findOne(id:string): Promise<Book>{
        //cari buku berdasarkan id
        const book = await this.bookRepository.findOneBy({id})

        //jika tidak ada
        if(!book){
            throw new NotFoundException (`Buku ${id} tidak di temukan`)
        }
        //jika data buku di temukan
        return book
    }
    //update data
    async updateData(id:string, createBookDto: CreateBookDto): Promise<Book>{
        const book = await this.findOne(id)
        
        //gabunkan perubhannya
        const updatedBook = this.bookRepository.merge(book, createBookDto)

        //simpan / update data
        return await this.bookRepository.save(updatedBook)
    }

    //menghapus data
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.bookRepository.softDelete(id)

        return {
            message: `Buku ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}