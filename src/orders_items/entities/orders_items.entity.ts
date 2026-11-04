import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Order } from "../../orders/entities/orders.entity.js";
import { Book } from "../../books/entitas/book-entity.js";

@Entity({name:'order_items'})
export class OrderItem{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'int', default:1})
    quantity: number;

    // harga satuan saat transaksi (snapshot, bukan books.price)
    @Column({type: 'decimal', precision:12, scale:2, default:0})
    price: number;

    @Column({type: 'decimal', precision:12, scale:2, default:0})
    subtotal: number;

    // banyak item dimiliki satu order many to one
    @ManyToOne(() => Order, (item) => item.items, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'order_id'})
    order: Relation<Order>;

    // banyak item merujuk satu buku many to one
    @ManyToOne(() => Book, (item) => item.orderItems)
    @JoinColumn({name: 'book_id'})
    book: Relation<Book>;

}