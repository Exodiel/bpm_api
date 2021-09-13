import { User } from '../user/user.entity';
import { Notification } from '../notification/notification.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Detail } from '../detail/detail.entity';
import { DetailUser } from '../detail-user/detail-user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
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
  discount: number;

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
  state: string; // creado | inventariado | procesando | completado | devuelto

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  origin: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => User, (user) => user.orders)
  person: User;

  @OneToMany(() => Detail, (detail) => detail.order)
  details: Detail[];

  @OneToMany(() => DetailUser, (detailuser) => detailuser.order)
  detailuser: DetailUser[];

  @OneToMany(() => Notification, (notification) => notification.order, {
    nullable: true,
  })
  notification: Notification[];
}
