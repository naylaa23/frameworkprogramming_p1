import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/orders.entity.js';
import { OrderItem } from '../orders_items/entities/orders_items.entity.js';
import { Book } from '../books/entitas/book-entity.js';
import { Customer } from '../customers/entities/customers.entity.js';
import { CreateOrderDto } from './dto/create-orders.dto.js';
import { UpdateOrderStatusDto } from './dto/update-orders.dto.js';

@Injectable()
export class OrdersService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,

        private readonly dataSource: DataSource
    ){}

    //logic untuk mendapatkan semua order (beserta customer, item, payment, shipment)
    async findAll(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: { customer: true, items: { book: true }, payment: true, shipment: true },
            order: { createdAt: 'DESC' }
        })
    }

    //simpan data (order + order_items dalam satu transaksi)
    async simpanData(createOrderDto: CreateOrderDto): Promise<Order>{
        const { customerId, items } = createOrderDto;

        //pastikan customer-nya ada
        const customer = await this.customerRepository.findOneBy({ id: customerId })
        if(!customer){
            throw new NotFoundException(`Customer ${customerId} tidak di temukan`)
        }

        //buku yang sama tidak boleh muncul dua kali
        const bookIds = items.map((item) => item.bookId)
        if(new Set(bookIds).size !== bookIds.length){
            throw new BadRequestException('Buku yang sama tidak boleh dobel, gabungkan jumlahnya')
        }

        const orderId = await this.dataSource.transaction(async (manager) => {
            //ambil semua buku yang dipesan
            const books = await manager.findBy(Book, { id: In(bookIds) })
            if(books.length !== bookIds.length){
                throw new NotFoundException('Ada buku yang tidak di temukan')
            }

            let total = 0
            const orderItems: OrderItem[] = []

            for(const item of items){
                const book = books.find((b) => b.id === item.bookId)!

                //cek ketersediaan dan stok
                if(!book.isAvailable || book.stock < item.quantity){
                    throw new BadRequestException(`Stok buku "${book.title}" tidak cukup`)
                }

                //harga diambil dari books.price sebagai snapshot saat transaksi
                const price = Number(book.price)
                const subtotal = price * item.quantity
                total += subtotal

                orderItems.push(manager.create(OrderItem, {
                    quantity: item.quantity,
                    price,
                    subtotal,
                    book,
                }))

                //kurangi stok
                book.stock -= item.quantity
                await manager.save(book)
            }

            const newOrder = manager.create(Order, {
                orderNumber: `ORD-${Date.now()}`,
                status: 'pending',
                totalAmount: total,
                customer,
            })
            const savedOrder = await manager.save(newOrder)

            //simpan item dengan order yang baru dibuat
            for(const orderItem of orderItems){
                orderItem.order = savedOrder
            }
            await manager.save(orderItems)

            return savedOrder.id
        })

        return await this.findOne(orderId)
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<Order>{
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: { customer: true, items: { book: true }, payment: true, shipment: true }
        })

        //jika tidak ada
        if(!order){
            throw new NotFoundException(`Order ${id} tidak di temukan`)
        }
        //jika data order di temukan
        return order
    }

    //update status pesanan
    async updateData(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>{
        await this.findOne(id)

        //update langsung ke database, lalu ambil data terbarunya
        await this.orderRepository.update(id, { status: updateOrderStatusDto.status })

        return await this.findOne(id)
    }

    //menghapus data (order tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.findOne(id)

        await this.orderRepository.delete(id)

        return {
            message: `Order ${id} berhasil dihapus`,
            deletedId: id
        }
    }
}