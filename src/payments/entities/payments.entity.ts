import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Order } from "../../orders/entities/orders.entity.js";

@Entity({name:'payments'})
export class Payment{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'payment_method', type: 'varchar', length:50})
    paymentMethod: string;

    @Column({type: 'decimal', precision:12, scale:2, default:0})
    amount: number;

    @Column({type: 'varchar', length:30, default:'pending'})
    status: string;

    @Column({name: 'paid_at', type: 'timestamp', nullable:true})
    paidAt: Date | null;

    // satu pembayaran dimiliki satu order one to one (order_id unik)
    @OneToOne(() => Order, (item) => item.payment, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'order_id'})
    order: Relation<Order>;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

}