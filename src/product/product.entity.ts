import { Category } from "../category/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Detail } from "../detail/detail.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    description: string;

    @Column({
        type: 'decimal',
        precision: 20,
        scale: 2,
        nullable: false,
    })
    cost: number;

    @Column({
        type: 'decimal',
        precision: 20,
        scale: 2,
        nullable: false,
    })
    price: number;

    @Column({
        type: 'smallint',
        nullable: false,
    })
    stock: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    image: string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    @ManyToOne(() => Category, category => category.products, {
        nullable: false
    })
    category: Category;

    @OneToMany(() => Detail, detail => detail.product)
    details: Detail[];
}