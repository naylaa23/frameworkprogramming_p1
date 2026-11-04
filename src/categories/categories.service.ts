import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-categories.dto.js';

@Injectable()
export class CategoriesService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    //logic untuk mendapatkan semua kategori (beserta buku-bukunya)
    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            relations: { books: true },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data
    async simpanData(createCategoryDto: CreateCategoryDto): Promise<Category>{
        const newCategory = this.categoryRepository.create(createCategoryDto);

        return await this.categoryRepository.save(newCategory);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Category>{
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: { books: true }
        })

        //jika tidak ada
        if(!category){
            throw new NotFoundException(`Kategori ${id} tidak di temukan`)
        }
        //jika data kategori di temukan
        return category
    }

    //update data
    async updateData(id: string, createCategoryDto: CreateCategoryDto): Promise<Category>{
        const category = await this.findOne(id)

        //gabungkan perubahannya
        const updatedCategory = this.categoryRepository.merge(category, createCategoryDto)

        //simpan / update data
        return await this.categoryRepository.save(updatedCategory)
    }

    //menghapus data (kategori tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.categoryRepository.delete(id)

        return {
            message: `Kategori ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}