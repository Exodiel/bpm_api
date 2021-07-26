import { EventSubscriber, EntitySubscriberInterface, getRepository, RemoveEvent } from 'typeorm';
import { Order } from '../order.entity';
import { Detail } from '../../detail/detail.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {

    listenTo() {
        return Order;
    }

    async beforeRemove(event: RemoveEvent<Order>) {
        const { id } = event.entity;
        const details = await getRepository(Detail)
            .createQueryBuilder('detail')
            .leftJoinAndSelect('detail.order', 'order')
            .leftJoinAndSelect('detail.product', 'product')
            .where('detail.orderId = :id', { id })
            .getMany();
        await getRepository(Detail).remove(details);
    }
}