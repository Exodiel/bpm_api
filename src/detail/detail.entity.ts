import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Detail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'decimal',
    precision: 20,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
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
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.details)
  order: Order;

  @ManyToOne(() => Product, (product) => product.details)
  product: Product;
}
