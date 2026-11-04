import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Order } from "../../orders/entities/orders.entity.js";

@Entity({name:'shipments'})
export class Shipment{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length:100})
    courier: string;

    @Column({name: 'tracking_number', type: 'varchar', length:100, nullable:true})
    trackingNumber: string | null;

    @Column({type: 'varchar', length:30, default:'pending'})
    status: string;

    @Column({name: 'shipped_at', type: 'timestamp', nullable:true})
    shippedAt: Date | null;

    @Column({name: 'delivered_at', type: 'timestamp', nullable:true})
    deliveredAt: Date | null;

    // satu shipment dimiliki satu order one to one (order_id unik)
    @OneToOne(() => Order, (item) => item.shipment, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'order_id'})
    order: Relation<Order>;

}