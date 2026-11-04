import { Test, TestingModule } from '@nestjs/testing';
import { OrdersItemsController } from './orders_items.controller.js';

describe('OrdersItemsController', () => {
  let controller: OrdersItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersItemsController],
    }).compile();

    controller = module.get<OrdersItemsController>(OrdersItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
