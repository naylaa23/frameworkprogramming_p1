    import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
    import { OrdersService } from './orders.service.js';
    import { Order } from './entities/orders.entity.js';
    import { CreateOrderDto } from './dto/create-orders.dto.js';
    import { UpdateOrderStatusDto } from './dto/update-orders.dto.js';

    @Controller('orders')
    export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    // menampilkan data
    @Get()
    async findAll(): Promise<Order[]> {
        return await this.ordersService.findAll();
    }

    // menyimpan data
    @Post()
    async simpanData(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return await this.ordersService.simpanData(createOrderDto);
    }

    // menampilkan data berdasarkan id
    @Get(':id')
    show(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    // mengupdate status pesanan
    @Put(':id')
    updateData(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateData(id, updateOrderStatusDto);
    }

    // menghapus data
    @Delete(':id')
    deleteData(@Param('id') id: string) {
        return this.ordersService.deleteData(id);
    }
    }