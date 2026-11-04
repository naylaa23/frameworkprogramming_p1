import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { Customer } from './entities/customers.entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customersService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customersService.simpanData(createCustomerDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  // mengupdate data
  @Put(':id')
  updateData(@Param('id') id: string, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.updateData(id, createCustomerDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.customersService.deleteData(id);
  }
}