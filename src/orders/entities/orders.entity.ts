import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Customer } from "../../customers/entities/customers.entity.js";
import { Payment } from "../../payments/entities/payments.entity.js";
import { OrderItem } from "../../orders_items/entities/orders_items.entity.js";
import { Shipment } from "../../shipments/entities/shipments.entity.js";

@Entity({name:'orders'})
export class Order{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'order_number', type: 'varchar', length:50, unique:true})
    orderNumber: string;

    @Column({type: 'varchar', length:30, default:'pending'})
    status: string;

    @Column({name: 'total_amount', type: 'decimal', precision:12, scale:2, default:0})
    totalAmount: number;

    // banyak order dimiliki satu customer many to one
    @ManyToOne(() => Customer, (item) => item.orders, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'customer_id'})
    customer: Relation<Customer>;

    // satu order punya banyak item one to many
    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[]

    // satu order punya satu payment one to one
    @OneToOne(() => Payment, (item) => item.order)
    payment: Relation<Payment>;

    // satu order punya satu shipment one to one
    @OneToOne(() => Shipment, (item) => item.order)
    shipment: Relation<Shipment>;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}