import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AuthorsService } from './authors.service.js';
import { Author } from './entities/authors.entity.js';
import { CreateAuthorDto } from './dto/create-authors.dto.js';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Author[]> {
    return await this.authorsService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return await this.authorsService.simpanData(createAuthorDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  // mengupdate data
  @Put(':id')
  updateData(@Param('id') id: string, @Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.updateData(id, createAuthorDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.authorsService.deleteData(id);
  }
}