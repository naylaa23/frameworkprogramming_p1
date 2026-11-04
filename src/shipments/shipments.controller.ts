import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';
import { Shipment } from './entities/shipments.entity.js';
import { CreateShipmentDto } from './dto/create-shipments.dto.js';
import { UpdateShipmentStatusDto } from './dto/update-shipments.dto.js';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Shipment[]> {
    return await this.shipmentsService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    return await this.shipmentsService.simpanData(createShipmentDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.shipmentsService.findOne(id);
  }

  // mengupdate status pengiriman
  @Put(':id')
  updateData(@Param('id') id: string, @Body() updateShipmentStatusDto: UpdateShipmentStatusDto) {
    return this.shipmentsService.updateData(id, updateShipmentStatusDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.shipmentsService.deleteData(id);
  }
}