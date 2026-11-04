import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrdersItemsService } from './orders_items.service.js';
import { OrderItem } from './entities/orders_items.entity.js';
import { CreateOrdersItemDto } from './dto/create-orders_items.dto.js';

@Controller('order-items')
export class OrdersItemsController {
  constructor(private readonly ordersItemsService: OrdersItemsService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<OrderItem[]> {
    return await this.ordersItemsService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createOrdersItemDto: CreateOrdersItemDto): Promise<OrderItem> {
    return await this.ordersItemsService.simpanData(createOrdersItemDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.ordersItemsService.findOne(id);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.ordersItemsService.deleteData(id);
  }
}