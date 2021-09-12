import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DetailUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  cause: string;

  @Column({
    type: 'varchar',
    length: 250,
  })
  description: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => Order, (order) => order.detailuser)
  order: Order;

  @ManyToOne(() => User, (user) => user.detailuser)
  user: User;
}
