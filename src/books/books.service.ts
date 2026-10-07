import { Injectable } from '@nestjs/common';
import { Book } from './entitas/book-entity.js';
import { CreateBookDto} from './dto/create-book.dto.js'

@Injectable()
export class BooksService { 
    //sampel data buku
    private books: Book[] = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            isbn: "978-0-7432-7356-5",
            publishedYear: 1925,
            isAvailable: true
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            isbn: "978-0-06-112008-4",
            publishedYear: 1960,
            isAvailable: false 
        }
    ];

    //Logic untuk menampilkan data 
    findAll(): Book[] {
        return this.books;
    }

    //simpan data 
    simpanData(createBookDto: CreateBookDto): Book{
        //simpan data ke array books
        const newBook: Book = {
            id: this.books.length +1,
            title: createBookDto.title,
            author: createBookDto.author,
            isbn: createBookDto.isbn,
            publishedYear: createBookDto.publishedYear,
            isAvailable: true
        }
        this.books.push(newBook);
        return newBook;
    }

    //Update data
    updateData(id: number, updateBookDto: CreateBookDto): Book {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            throw new Error(`Buku dengan ID ${id} tidak ditemukan.`);
        }
        const updatedBook: Book = {
            ...this.books[bookIndex],
            title: updateBookDto.title,
            author: updateBookDto.author,
            isbn: updateBookDto.isbn,
            publishedYear: updateBookDto.publishedYear
        }
        this.books[bookIndex] = updatedBook;
        return updatedBook;
    }

    //hapus data
    hapusdata(id: number, createBookDto: CreateBookDto): Book {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            throw new Error(`Buku dengan ID ${id} tidak ditemukan.`);
        }
        const deletedBook: Book = this.books[bookIndex];
        this.books.splice(bookIndex, 1);
        return deletedBook;
    }

}
