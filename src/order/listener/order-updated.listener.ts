import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DetailUserService } from '../../detail-user/detail-user.service';
import { NotificationService } from '../../notification/notification.service';
import { OrderUpdatedEvent } from '../event/order-updated.event';
import { DetailService } from '../../detail/detail.service';
import { getDateWithTime } from '../../utils/date-formatting';

@Injectable()
export class OrderUpdatedListener {
  constructor(
    private readonly detailUserService: DetailUserService,
    private readonly notificationService: NotificationService,
    private readonly detailService: DetailService,
  ) {}
  @OnEvent('order.updated')
  async handleOrderUpdatedEvent(event: OrderUpdatedEvent) {
    const date = getDateWithTime();
    await this.detailService.updateStock(event.state, event.id);
    const { title, topic } = this.notificationService.getValuesByState(
      event.state,
    );
    await this.detailUserService.create({
      cause: topic,
      description: title,
      orderId: event.id,
      userId: event.employeeId,
    });
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
