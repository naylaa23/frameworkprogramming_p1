import { Test, TestingModule } from '@nestjs/testing';
import { CustomersAddressesController } from './customers_addresses.controller.js';

describe('CustomersAddressesController', () => {
  let controller: CustomersAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersAddressesController],
    }).compile();

    controller = module.get<CustomersAddressesController>(CustomersAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
