import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-categories.dto.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.simpanData(createCategoryDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // mengupdate data
  @Put(':id')
  updateData(@Param('id') id: string, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.updateData(id, createCategoryDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.categoriesService.deleteData(id);
  }
}