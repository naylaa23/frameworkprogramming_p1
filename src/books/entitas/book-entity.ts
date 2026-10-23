import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'update_at'})
    updateAt: Date;

    @DeleteDateColumn({name:'deleted_at', nullable:true})
    deletedAt: Date;
}