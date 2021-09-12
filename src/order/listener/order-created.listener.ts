import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import { OrderCreatedEvent } from '../event/order-created.event';
import { getDateWithTime } from '../../utils/date-formatting';

@Injectable()
export class OrderCreatedListener {
  constructor(private readonly notificationService: NotificationService) {}
  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    const date = getDateWithTime();
    const { title, topic } = this.notificationService.getValuesByState(
      event.state,
    );
    await this.notificationService.createNotification({
      title,
      body: date,
      data: '',
      imageUrl: '',
      topic,
      orderId: event.id,
    });
  }
}
