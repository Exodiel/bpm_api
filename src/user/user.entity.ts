import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Order } from '../order/order.entity';
import { Notification } from '../notification/notification.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
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
    length: 120,
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 120,
    unique: true,
    nullable: false,
  })
  email: string;

  // admin | vendedor | bodeguero | transportista
  @Column({
    type: 'varchar',
    length: 13,
    nullable: true,
  })
  rol: string;

  @Column({
    type: 'varchar',
    length: 13,
    unique: true,
    nullable: true,
  })
  identification: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  identification_type: string;

  @Column({
    type: 'integer',
    default: 1,
  })
  active: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
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

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    nullable: true,
  })
  notification: Notification[];
}
