import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Book } from "../../books/entitas/book-entity.js";

@Entity({name:'publishers'})
export class Publisher{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length:150})
    name: string;

    // satu penerbit menerbitkan banyak buku one to many
    @OneToMany(() => Book, (item) => item.publisher)
    books: Book[]

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}