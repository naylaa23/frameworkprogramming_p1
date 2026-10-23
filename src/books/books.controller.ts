import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { Book } from './entitas/book-entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Book[]> {
    return await this.booksService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return await this.booksService.simpanData(createBookDto);
  }

  // // mengupdate data
  // @Put(':id')
  // updateData(@Param('id') id: string, @Body() createBookDto: CreateBookDto) {
  //   return this.booksService.updateData(Number(id), createBookDto);
  // }

  // // menghapus data
  // @Delete(':id')
  // hapusdata(@Param('id') id: string) {
  //   return this.booksService.hapusdata(parseInt(id));
  // }
}