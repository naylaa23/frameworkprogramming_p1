import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/authors.entity.js';
import { CreateAuthorDto } from './dto/create-authors.dto.js';

@Injectable()
export class AuthorsService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>
    ){}

    //logic untuk mendapatkan semua penulis (beserta buku-bukunya)
    async findAll(): Promise<Author[]> {
        return await this.authorRepository.find({
            relations: { bookAuthors: { book: true } },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data
    async simpanData(createAuthorDto: CreateAuthorDto): Promise<Author>{
        const newAuthor = this.authorRepository.create(createAuthorDto);

        return await this.authorRepository.save(newAuthor);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Author>{
        const author = await this.authorRepository.findOne({
            where: { id },
            relations: { bookAuthors: { book: true } }
        })

        //jika tidak ada
        if(!author){
            throw new NotFoundException(`Penulis ${id} tidak di temukan`)
        }
        //jika data penulis di temukan
        return author
    }

    //update data
    async updateData(id: string, createAuthorDto: CreateAuthorDto): Promise<Author>{
        await this.findOne(id)

        //update langsung ke database, lalu ambil data terbarunya
        await this.authorRepository.update(id, createAuthorDto)

        return await this.findOne(id)
    }

    //menghapus data (penulis tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.authorRepository.delete(id)

        return {
            message: `Penulis ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}