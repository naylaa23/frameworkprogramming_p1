import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAddress } from './entities/customer_addresses.entity.js';
import { Customer } from '../customers/entities/customers.entity.js';
import { CreateCustomerAddressDto } from './dto/create-customers_addresses.dto.js';

@Injectable()
export class CustomersAddressesService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(CustomerAddress)
        private readonly addressRepository: Repository<CustomerAddress>,

        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ){}

    //logic untuk mendapatkan semua alamat (beserta customer-nya)
    async findAll(): Promise<CustomerAddress[]> {
        return await this.addressRepository.find({
            relations: { customer: true },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data
    async simpanData(createCustomerAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress>{
        const { customerId, ...data } = createCustomerAddressDto;

        //pastikan customer-nya ada
        await this.cekCustomer(customerId)

        const newAddress = this.addressRepository.create({
            ...data,
            customerId,
        });

        return await this.addressRepository.save(newAddress);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<CustomerAddress>{
        const address = await this.addressRepository.findOne({
            where: { id },
            relations: { customer: true }
        })

        //jika tidak ada
        if(!address){
            throw new NotFoundException(`Alamat ${id} tidak di temukan`)
        }
        //jika data alamat di temukan
        return address
    }

    //update data
    async updateData(id: string, createCustomerAddressDto: CreateCustomerAddressDto): Promise<CustomerAddress>{
        await this.findOne(id)

        //pastikan customer-nya ada
        await this.cekCustomer(createCustomerAddressDto.customerId)

        //update langsung ke database, lalu ambil data terbarunya
        await this.addressRepository.update(id, createCustomerAddressDto)

        return await this.findOne(id)
    }

    //menghapus data (alamat tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.addressRepository.delete(id)

        return {
            message: `Alamat ${id} berhasil dihapus`,
            deletedId: id
        }
    }

    //cek apakah customer ada
    private async cekCustomer(customerId: string){
        const customer = await this.customerRepository.findOneBy({ id: customerId })
        if(!customer){
            throw new NotFoundException(`Customer ${customerId} tidak di temukan`)
        }
    }
}