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
    const { product, quantity, order } = event.entity;
    if (order.type === 'Compra') {
      const newStock = product.stock + quantity;
      await getRepository(Product)
        .createQueryBuilder()
        .update(Product)
        .set({ stock: newStock })
        .where('id = :id', { id: product.id })
        .execute();
    }
  }

  async beforeRemove(event: RemoveEvent<Detail>) {
    const { product, quantity, order } = event.entity;
    let updatedStock = product.stock;
    if (order.state === 'creado' && order.type === 'Venta') {
      updatedStock = product.stock + quantity;
    }

    if (order.type === 'Compra') {
      updatedStock = product.stock - quantity;
    }
    await getRepository(Product)
      .createQueryBuilder('product')
      .update(Product)
      .set({ stock: updatedStock })
      .where('product.id = :id', { id: product.id })
      .execute();
  }
}
