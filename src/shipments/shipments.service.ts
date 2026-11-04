import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Shipment } from './entities/shipments.entity.js';
import { Order } from '../orders/entities/orders.entity.js';
import { CreateShipmentDto } from './dto/create-shipments.dto.js';
import { UpdateShipmentStatusDto } from './dto/update-shipments.dto.js';

@Injectable()
export class ShipmentsService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        private readonly dataSource: DataSource
    ){}

    //logic untuk mendapatkan semua pengiriman (beserta order-nya)
    async findAll(): Promise<Shipment[]> {
        return await this.shipmentRepository.find({
            relations: { order: true }
        })
    }

    //simpan data
    async simpanData(createShipmentDto: CreateShipmentDto): Promise<Shipment>{
        const { orderId, courier, trackingNumber } = createShipmentDto;

        //pastikan order-nya ada
        const order = await this.orderRepository.findOneBy({ id: orderId })
        if(!order){
            throw new NotFoundException(`Order ${orderId} tidak di temukan`)
        }

        //hanya order yang sudah dibayar yang boleh dikirim
        if(order.status !== 'paid' && order.status !== 'processing'){
            throw new BadRequestException(`Order berstatus "${order.status}", belum bisa dikirim`)
        }

        //satu order hanya boleh punya satu pengiriman (one to one)
        const sudahAda = await this.shipmentRepository.findOne({
            where: { order: { id: orderId } }
        })
        if(sudahAda){
            throw new ConflictException(`Order ${orderId} sudah punya pengiriman`)
        }

        const newShipment = this.shipmentRepository.create({
            courier,
            trackingNumber: trackingNumber ?? null,
            status: 'pending',
            shippedAt: null,
            deliveredAt: null,
            order,
        });

        return await this.shipmentRepository.save(newShipment);
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Shipment>{
        const shipment = await this.shipmentRepository.findOne({
            where: { id },
            relations: { order: true }
        })

        //jika tidak ada
        if(!shipment){
            throw new NotFoundException(`Pengiriman ${id} tidak di temukan`)
        }
        //jika data pengiriman di temukan
        return shipment
    }

    //update status pengiriman (pending -> shipped -> delivered)
    async updateData(id: string, updateShipmentStatusDto: UpdateShipmentStatusDto): Promise<Shipment>{
        const shipment = await this.findOne(id)
        const { status, trackingNumber } = updateShipmentStatusDto;

        if(shipment.status === 'delivered'){
            throw new BadRequestException('Pengiriman sudah berstatus delivered, tidak bisa diubah')
        }

        await this.dataSource.transaction(async (manager) => {
            if(status === 'shipped'){
                if(shipment.status !== 'pending'){
                    throw new BadRequestException('Hanya pengiriman pending yang bisa menjadi shipped')
                }

                //nomor resi wajib ada saat barang dikirim
                const resi = trackingNumber ?? shipment.trackingNumber
                if(!resi){
                    throw new BadRequestException('Nomor resi harus diisi saat status shipped')
                }

                await manager.update(Shipment, id, {
                    status,
                    trackingNumber: resi,
                    shippedAt: new Date()
                })
                await manager.update(Order, shipment.order.id, { status: 'shipped' })
            } else {
                //status delivered
                if(shipment.status !== 'shipped'){
                    throw new BadRequestException('Pengiriman harus shipped dulu sebelum delivered')
                }

                await manager.update(Shipment, id, { status, deliveredAt: new Date() })
                await manager.update(Order, shipment.order.id, { status: 'completed' })
            }
        })

        return await this.findOne(id)
    }

    //menghapus data (pengiriman tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        const shipment = await this.findOne(id)

        //pengiriman yang sudah berjalan tidak boleh dihapus
        if(shipment.status !== 'pending'){
            throw new BadRequestException(`Pengiriman berstatus "${shipment.status}", tidak bisa dihapus`)
        }

        await this.shipmentRepository.delete(id)

        return {
            message: `Pengiriman ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}