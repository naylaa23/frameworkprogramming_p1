import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customers.entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';

@Injectable()
export class CustomersService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ){}

    //logic untuk mendapatkan semua customer (beserta alamat dan order)
    async findAll(): Promise<Customer[]> {
        return await this.customerRepository.find({
            relations: { addresses: true, orders: true },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data
    async simpanData(createCustomerDto: CreateCustomerDto): Promise<Customer>{
        //email tidak boleh sama
        const emailAda = await this.customerRepository.findOneBy({email: createCustomerDto.email})
        if(emailAda){
            throw new ConflictException(`Email ${createCustomerDto.email} sudah terdaftar`)
        }

        const newCustomer = this.customerRepository.create(createCustomerDto);

        return await this.customerRepository.save(newCustomer);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Customer>{
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: { addresses: true, orders: true }
        })

        //jika tidak ada
        if(!customer){
            throw new NotFoundException(`Customer ${id} tidak di temukan`)
        }
        //jika data customer di temukan
        return customer
    }

    //update data
    async updateData(id: string, createCustomerDto: CreateCustomerDto): Promise<Customer>{
        const customer = await this.findOne(id)

        //email baru tidak boleh dipakai customer lain
        if(createCustomerDto.email !== customer.email){
            const emailAda = await this.customerRepository.findOneBy({email: createCustomerDto.email})
            if(emailAda){
                throw new ConflictException(`Email ${createCustomerDto.email} sudah terdaftar`)
            }
        }

        //gabungkan perubahannya
        const updatedCustomer = this.customerRepository.merge(customer, createCustomerDto)

        //simpan / update data
        return await this.customerRepository.save(updatedCustomer)
    }

    //menghapus data (soft delete)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.customerRepository.softDelete(id)

        return {
            message: `Customer ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}