import { Test, TestingModule } from '@nestjs/testing';
import { OrdersItemsService } from './orders_items.service.js';

describe('OrdersItemsService', () => {
  let service: OrdersItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersItemsService],
    }).compile();

    service = module.get<OrdersItemsService>(OrdersItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
