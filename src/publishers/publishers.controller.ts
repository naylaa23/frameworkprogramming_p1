import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PublishersService } from './publishers.service.js';
import { Publisher } from './entities/publishers.entity.js';
import { CreatePublisherDto } from './dto/create-publishers.dto.js';

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Publisher[]> {
    return await this.publishersService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return await this.publishersService.simpanData(createPublisherDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.publishersService.findOne(id);
  }

  // mengupdate data
  @Put(':id')
  updateData(@Param('id') id: string, @Body() createPublisherDto: CreatePublisherDto) {
    return this.publishersService.updateData(id, createPublisherDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.publishersService.deleteData(id);
  }
}