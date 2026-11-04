import { Test, TestingModule } from '@nestjs/testing';
import { CustomersAddressesService } from './customers_addresses.service.js';

describe('CustomersAddressesService', () => {
  let service: CustomersAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersAddressesService],
    }).compile();

    service = module.get<CustomersAddressesService>(CustomersAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
