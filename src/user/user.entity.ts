import {BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { hash } from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: '250',
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 80
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 20
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 60,
        unique: true
    })
    email: string;

    // admin | vendedor | bodeguero | transportista
    @Column({
        type: 'varchar',
        length: 13
    })  
    rol: string;

    @Column({
        type: 'varchar',
        length: 13,
        unique: true,
        nullable: true
    })
    identification: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    image: string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    @BeforeInsert()
    async updatePassword() {
        this.password = await hash(this.password, 12);
    }

    @BeforeUpdate()
    async updatePasswordBeforeAction() {
        this.password = await hash(this.password, 12);
    }
}
