import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment } from './entities/payments.entity.js';
import { Order } from '../orders/entities/orders.entity.js';
import { CreatePaymentDto } from './dto/create-payments.dto.js';
import { UpdatePaymentStatusDto } from './dto/update-payments.dto.js';

@Injectable()
export class PaymentsService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        private readonly dataSource: DataSource
    ){}

    //logic untuk mendapatkan semua pembayaran (beserta order-nya)
    async findAll(): Promise<Payment[]> {
        return await this.paymentRepository.find({
            relations: { order: true },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data
    async simpanData(createPaymentDto: CreatePaymentDto): Promise<Payment>{
        const { orderId, paymentMethod } = createPaymentDto;

        //pastikan order-nya ada
        const order = await this.orderRepository.findOneBy({ id: orderId })
        if(!order){
            throw new NotFoundException(`Order ${orderId} tidak di temukan`)
        }

        //hanya order pending yang boleh dibayar
        if(order.status !== 'pending'){
            throw new BadRequestException(`Order berstatus "${order.status}", tidak bisa dibuatkan pembayaran`)
        }

        //satu order hanya boleh punya satu pembayaran (one to one)
        const sudahAda = await this.paymentRepository.findOne({
            where: { order: { id: orderId } }
        })
        if(sudahAda){
            throw new ConflictException(`Order ${orderId} sudah punya pembayaran`)
        }

        const newPayment = this.paymentRepository.create({
            paymentMethod,
            //jumlah diambil dari total order
            amount: Number(order.totalAmount),
            status: 'pending',
            paidAt: null,
            order,
        });

        return await this.paymentRepository.save(newPayment);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Payment>{
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: { order: true }
        })

        //jika tidak ada
        if(!payment){
            throw new NotFoundException(`Pembayaran ${id} tidak di temukan`)
        }
        //jika data pembayaran di temukan
        return payment
    }

    //update status pembayaran
    async updateData(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto): Promise<Payment>{
        const payment = await this.findOne(id)
        const { status } = updatePaymentStatusDto;

        //pembayaran yang sudah berhasil tidak boleh diubah lagi
        if(payment.status === 'paid'){
            throw new BadRequestException('Pembayaran sudah berstatus paid, tidak bisa diubah')
        }

        await this.dataSource.transaction(async (manager) => {
            if(status === 'paid'){
                //catat waktu bayar dan ubah status order menjadi paid
                await manager.update(Payment, id, { status, paidAt: new Date() })
                await manager.update(Order, payment.order.id, { status: 'paid' })
            } else {
                await manager.update(Payment, id, { status, paidAt: null })
            }
        })

        return await this.findOne(id)
    }

    //menghapus data (pembayaran tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        const payment = await this.findOne(id)

        //pembayaran yang sudah berhasil tidak boleh dihapus
        if(payment.status === 'paid'){
            throw new BadRequestException('Pembayaran yang sudah paid tidak bisa dihapus')
        }

        await this.paymentRepository.delete(id)

        return {
            message: `Pembayaran ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}