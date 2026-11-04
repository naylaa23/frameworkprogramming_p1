import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomersAddressesService } from './customers_addresses.service.js';
import { CustomerAddress } from './entities/customer_addresses.entity.js';
import { CreateCustomerAddressDto } from './dto/create-customers_addresses.dto.js';

@Controller('customer-addresses')
export class CustomersAddressesController {
  constructor(private readonly customersAddressesService: CustomersAddressesService) {}

  // menampilkan data
  @Get()
  async findAll(): Promise<CustomerAddress[]> {
    return await this.customersAddressesService.findAll();
  }

  // menyimpan data
  @Post()
  async simpanData(@Body() createCustomerAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress> {
    return await this.customersAddressesService.simpanData(createCustomerAddressDto);
  }

  // menampilkan data berdasarkan id
  @Get(':id')
  show(@Param('id') id: string) {
    return this.customersAddressesService.findOne(id);
  }

  // mengupdate data
  @Put(':id')
  updateData(@Param('id') id: string, @Body() createCustomerAddressDto: CreateCustomerAddressDto) {
    return this.customersAddressesService.updateData(id, createCustomerAddressDto);
  }

  // menghapus data
  @Delete(':id')
  deleteData(@Param('id') id: string) {
    return this.customersAddressesService.deleteData(id);
  }
}