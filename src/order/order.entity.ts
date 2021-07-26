import { User } from "../user/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Detail } from "../detail/detail.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  sequential: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: string;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: false,
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  tax: number;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: false,
  })
  total: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  payment: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  state: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  address: string;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @OneToMany(() => Detail, detail => detail.order)
  details: Detail[];
}