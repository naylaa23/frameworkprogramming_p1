import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerAddress } from "../../customers_addresses/entities/customer_addresses.entity.js";
import { Order } from "../../orders/entities/orders.entity.js";

@Entity({name:'customers'})
export class Customer{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length:150})
    name: string;

    @Column({type: 'varchar', length:150, unique:true})
    email: string;

    @Column({type: 'varchar', length:20, nullable:true})
    phone: string | null;

    // satu customer mempunyai banyak alamat one to many
    @OneToMany(() => CustomerAddress, (item) => item.customer)
    addresses: CustomerAddress[]

    // satu customer mempunyai banyak order one to many
    @OneToMany(() => Order, (item) => item.customer)
    orders: Order[]

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at', nullable:true})
    deletedAt: Date | null;

}