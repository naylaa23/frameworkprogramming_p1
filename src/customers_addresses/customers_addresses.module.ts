import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersAddressesController } from './customers_addresses.controller.js';
import { CustomersAddressesService } from './customers_addresses.service.js';
import { CustomerAddress } from './entities/customer_addresses.entity.js';
import { Customer } from '../customers/entities/customers.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddress, Customer])],
  controllers: [CustomersAddressesController],
  providers: [CustomersAddressesService],
  exports: [CustomersAddressesService, TypeOrmModule],
})
export class CustomersAddressesModule {}