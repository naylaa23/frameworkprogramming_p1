import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entities/orders_items.entity.js';
import { Order } from '../orders/entities/orders.entity.js';
import { Book } from '../books/entitas/book-entity.js';
import { CreateOrdersItemDto } from './dto/create-orders_items.dto.js';

@Injectable()
export class OrdersItemsService {
    //fungsi untuk akses ke database
    constructor(
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,

        private readonly dataSource: DataSource
    ){}

    //logic untuk mendapatkan semua item (beserta order dan buku)
    async findAll(): Promise<OrderItem[]> {
        return await this.orderItemRepository.find({
            relations: { order: true, book: true }
        })
    }

    //simpan data (tambah item ke order yang sudah ada)
    async simpanData(createOrdersItemDto: CreateOrdersItemDto): Promise<OrderItem>{
        const { orderId, bookId, quantity } = createOrdersItemDto;

        const itemId = await this.dataSource.transaction(async (manager) => {
            //pastikan order-nya ada dan masih pending
            const order = await manager.findOneBy(Order, { id: orderId })
            if(!order){
                throw new NotFoundException(`Order ${orderId} tidak di temukan`)
            }
            this.cekPending(order)

            //pastikan buku-nya ada
            const book = await manager.findOneBy(Book, { id: bookId })
            if(!book){
                throw new NotFoundException(`Buku ${bookId} tidak di temukan`)
            }

            //buku yang sama tidak boleh dobel dalam satu order
            const sudahAda = await manager.findOne(OrderItem, {
                where: { order: { id: orderId }, book: { id: bookId } }
            })
            if(sudahAda){
                throw new BadRequestException('Buku sudah ada di order ini, hapus item lama lalu buat ulang')
            }

            //cek ketersediaan dan stok
            if(!book.isAvailable || book.stock < quantity){
                throw new BadRequestException(`Stok buku "${book.title}" tidak cukup`)
            }

            //harga diambil dari books.price sebagai snapshot saat transaksi
            const price = Number(book.price)
            const subtotal = price * quantity

            const newItem = manager.create(OrderItem, { quantity, price, subtotal, order, book })
            const savedItem = await manager.save(newItem)

            //kurangi stok dan tambah total order
            await manager.update(Book, book.id, { stock: book.stock - quantity })
            await manager.update(Order, order.id, { totalAmount: Number(order.totalAmount) + subtotal })

            return savedItem.id
        })

        return await this.findOne(itemId)
    }

    // menampilkan data berdasarkan id
    async findOne(id: string): Promise<OrderItem>{
        const item = await this.orderItemRepository.findOne({
            where: { id },
            relations: { order: true, book: true }
        })

        //jika tidak ada
        if(!item){
            throw new NotFoundException(`Item ${id} tidak di temukan`)
        }
        //jika data item di temukan
        return item
    }

    //menghapus data (item tidak punya deleted_at, jadi dihapus permanen)
    async deleteData(id: string): Promise<{message: string, deletedId: string}>{
        await this.dataSource.transaction(async (manager) => {
            const item = await manager.findOne(OrderItem, {
                where: { id },
                relations: { order: true, book: true }
            })
            if(!item){
                throw new NotFoundException(`Item ${id} tidak di temukan`)
            }
            this.cekPending(item.order)

            //order harus punya minimal 1 item
            const jumlahItem = await manager.count(OrderItem, {
                where: { order: { id: item.order.id } }
            })
            if(jumlahItem <= 1){
                throw new BadRequestException('Order harus punya minimal 1 item, hapus order-nya saja')
            }

            //kembalikan stok dan kurangi total order
            await manager.update(Book, item.book.id, { stock: item.book.stock + item.quantity })
            await manager.update(Order, item.order.id, {
                totalAmount: Number(item.order.totalAmount) - Number(item.subtotal)
            })
            await manager.delete(OrderItem, id)
        })

        return {
            message: `Item ${id} berhasil dihapus`,
            deletedId: id
        }
    }

    //item hanya boleh diubah selama order masih pending
    private cekPending(order: Order){
        if(order.status !== 'pending'){
            throw new BadRequestException(`Order berstatus "${order.status}", item tidak bisa diubah`)
        }
    }
}