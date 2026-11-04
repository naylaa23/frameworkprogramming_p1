import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Category } from '../../categories/entities/category.entity.js';
import { Publisher } from '../../publishers/entities/publishers.entity.js';
import { BookAuthor } from '../../book_authors/entities/book_authors.entity.js';
import { OrderItem } from '../../orders_items/entities/orders_items.entity.js';

@Entity({name: 'books'})
export class Book{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({type: 'varchar', length: 65})
    title : string;

    @Column({type: 'varchar', length: 45, unique: true})
    isbn : string;

    @Column({type: 'int', default:0})
    publishedYear: number;

    @Column({type: 'boolean', default:true})
    isAvailable : boolean;

    @Column({type: 'decimal', precision: 12, scale: 2, default: 0})
    price : number;

    @Column({type: 'int', default: 0})
    stock : number;

    // banyak buku punya satu kategori, many to one
    @ManyToOne(() => Category, (item) => item.books)
    @JoinColumn({name: 'category_id'})
    category : Relation<Category>

    // banyak buku diterbitkan satu penerbit, many to one
    @ManyToOne(() => Publisher, (item) => item.books)
    @JoinColumn({name: 'publisher_id'})
    publisher : Relation<Publisher>

    // satu buku punya banyak baris book_authors one to many
    @OneToMany(() => BookAuthor, (item) => item.book)
    bookAuthors : BookAuthor[]

    // satu buku muncul di banyak order_items one to many
    @OneToMany(() => OrderItem, (item) => item.book)
    orderItems : OrderItem[]

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name:'deleted_at', nullable:true})
    deletedAt: Date | null;
}