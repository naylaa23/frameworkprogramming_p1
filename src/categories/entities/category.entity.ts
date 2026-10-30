import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Book } from "../../books/entitas/book-entity.js";

@Entity({name:'categories'})
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length:65})
    nama: string;

    // satu kategori mempunyai banyak buku one to many 
    @OneToMany(() => Book, (item) => item.id,{
        cascade:true
    })
    books: Book[]

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updateAt: Date;



}