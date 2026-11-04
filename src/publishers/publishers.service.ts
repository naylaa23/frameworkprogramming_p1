import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './entities/publishers.entity.js';
import { CreatePublisherDto } from './dto/create-publishers.dto.js';

@Injectable()
export class PublishersService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Publisher)
        private readonly publisherRepository: Repository<Publisher>
    ){}

    //logic untuk mendapatkan semua penerbit (beserta buku-bukunya)
    async findAll(): Promise<Publisher[]> {
        return await this.publisherRepository.find({
            relations: { books: true },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data
    async simpanData(createPublisherDto: CreatePublisherDto): Promise<Publisher>{
        const newPublisher = this.publisherRepository.create(createPublisherDto);

        return await this.publisherRepository.save(newPublisher);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Publisher>{
        const publisher = await this.publisherRepository.findOne({
            where: { id },
            relations: { books: true }
        })

        //jika tidak ada
        if(!publisher){
            throw new NotFoundException(`Penerbit ${id} tidak di temukan`)
        }
        //jika data penerbit di temukan
        return publisher
    }

    //update data
    async updateData(id: string, createPublisherDto: CreatePublisherDto): Promise<Publisher>{
        const publisher = await this.findOne(id)

        //gabungkan perubahannya
        const updatedPublisher = this.publisherRepository.merge(publisher, createPublisherDto)

        //simpan / update data
        return await this.publisherRepository.save(updatedPublisher)
    }

    //menghapus data (penerbit tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.publisherRepository.delete(id)

        return {
            message: `Penerbit ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}