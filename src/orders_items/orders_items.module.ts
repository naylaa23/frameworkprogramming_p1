import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersItemsController } from './orders_items.controller.js';
import { OrdersItemsService } from './orders_items.service.js';
import { OrderItem } from './entities/orders_items.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrdersItemsController],
  providers: [OrdersItemsService],
  exports: [OrdersItemsService, TypeOrmModule],
})
export class OrdersItemsModule {}