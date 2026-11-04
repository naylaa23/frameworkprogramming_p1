import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Book } from "../../books/entitas/book-entity.js";
import { Author } from "../../authors/entities/authors.entity.js";
import type { Relation } from "typeorm";

@Entity({name:'book_authors'})
export class BookAuthor{

    // primary key gabungan (book_id, author_id)
    @PrimaryColumn({name: 'book_id', type: 'uuid'})
    bookId: string;

    @PrimaryColumn({name: 'author_id', type: 'uuid'})
    authorId: string;

    // banyak book_authors dimiliki satu buku many to one
    @ManyToOne(() => Book, (item) => item.bookAuthors, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'book_id'})
    book: Relation<Book>;   

    // banyak book_authors dimiliki satu penulis many to one
    @ManyToOne(() => Author, (item) => item.bookAuthors, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'author_id'})
    author: Relation<Author>;

}