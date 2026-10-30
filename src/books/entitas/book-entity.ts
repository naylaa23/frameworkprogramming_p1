import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from '../../categories/entities/category.entity.js';

@Entity({name: 'books'})
export class Book{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({type: 'varchar', length: 65})
    title : string;

    @Column({type: 'varchar', length: 100})
    author : string;

    @Column({type: 'varchar'})
    isbn : string;

    @Column({type: 'int', default:0})
    publishedYear: number;

    @Column({type: 'boolean', default:true})
    isAvailable : boolean;

    //satu buku punya satu kategori, 1:1
    @OneToOne(() => Category, {cascade:true})
    @JoinColumn({name: 'category_id'})
    category : Category 

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'update_at'})
    updateAt: Date;

    @DeleteDateColumn({name:'deleted_at', nullable:true})
    deletedAt: Date;
}