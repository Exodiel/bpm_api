import {
  EventSubscriber,
  EntitySubscriberInterface,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Order } from '../order.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  listenTo() {
    return Order;
  }

  async beforeUpdate(event: UpdateEvent<Order>) {
    console.log('event', event.entity);
  }

  async beforeRemove(event: RemoveEvent<Order>) {
    console.log('event', event.entity);
  }
}
