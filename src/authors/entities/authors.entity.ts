import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookAuthor } from "../../book_authors/entities/book_authors.entity.js";

@Entity({name:'authors'})
export class Author{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length:150})
    name: string;

    // satu penulis punya banyak baris book_authors one to many
    @OneToMany(() => BookAuthor, (item) => item.author)
    bookAuthors: BookAuthor[]

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}