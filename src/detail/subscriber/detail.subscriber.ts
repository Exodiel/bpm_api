import { Product } from '../../product/product.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  getRepository,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Detail } from '../detail.entity';

@EventSubscriber()
export class DetailSubscriber implements EntitySubscriberInterface<Detail> {
  listenTo() {
    return Detail;
  }

  async afterInsert(event: InsertEvent<Detail>) {
    const { quantity, product } = event.entity;
    const newStock = product.stock - quantity;
    await getRepository(Product)
      .createQueryBuilder()
      .update(Product)
      .set({ stock: newStock })
      .where('id = :id', { id: product.id })
      .execute();
  }

  async beforeRemove(event: RemoveEvent<Detail>) {
    const { product, quantity } = event.entity;
    const updatedStock = product.stock + quantity;
    await getRepository(Product)
      .createQueryBuilder('product')
      .update(Product)
      .set({ stock: updatedStock })
      .where('product.id = :id', { id: product.id })
      .execute();
  }
}
