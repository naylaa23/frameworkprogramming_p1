import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BookAuthorsService } from './book_authors.service.js';
import { BookAuthor } from './entities/book_authors.entity.js';
import { CreateBookAuthorDto } from './dto/create-book_authors.dto.js';

@Controller('book-authors')
export class BookAuthorsController {
  constructor(private readonly bookAuthorsService: BookAuthorsService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<BookAuthor[]> {
    return await this.bookAuthorsService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createBookAuthorDto: CreateBookAuthorDto): Promise<BookAuthor> {
    return await this.bookAuthorsService.simpanData(createBookAuthorDto);
  }

  // menampilkan data berdasarkan bookId dan authorId
  @Get(':bookId/:authorId')
  show(@Param('bookId') bookId: string, @Param('authorId') authorId: string) {
    return this.bookAuthorsService.findOne(bookId, authorId);
  }

  // menghapus data
  @Delete(':bookId/:authorId')
  deleteData(@Param('bookId') bookId: string, @Param('authorId') authorId: string) {
    return this.bookAuthorsService.deleteData(bookId, authorId);
  }
}