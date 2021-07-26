import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { hash } from "bcrypt";
import { Order } from "../order/order.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: '250',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  email: string;

  // admin | vendedor | bodeguero | transportista
  @Column({
    type: 'varchar',
    length: 13,
    nullable: false,
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
    length: 10,
    nullable: true
  })
  type: string;

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

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
