import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { ReadNotificationDTO } from './dto/read-notification.dto';
import { Notification } from './notification.entity';
import { plainToClass } from 'class-transformer';
import { CriteriaDTO } from '../shared/dto/criteria.dto';
import { AppGateway } from '../app.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private gateway: AppGateway,
  ) { }

  async createNotification(
    notificationDTO: CreateNotificationDTO,
  ): Promise<ReadNotificationDTO> {
    const { body, data, imageUrl, title, topic, orderId } = notificationDTO;
    const order: Order = await this.orderRepository.findOneOrFail(orderId);

    const newNotification: Notification = this.notificationRepository.create({
      body,
      data,
      imageUrl,
      title,
      topic,
      order,
    });

    await this.notificationRepository.save(newNotification);
    this.gateway.wss.emit('new-notification', newNotification);
    return plainToClass(ReadNotificationDTO, newNotification);
  }

  async findAll(
    criteria: CriteriaDTO,
  ): Promise<[ReadNotificationDTO[], number]> {
    const [notificationsFilter, counter] =
      await this.notificationRepository.findAndCount({
        relations: ['order'],
        take: parseInt(criteria.limit),
        skip: parseInt(criteria.offset),
        order: {
          id: 'DESC',
        },
      });

    const notifications = notificationsFilter.map((notification) =>
      plainToClass(ReadNotificationDTO, notification),
    );

    return [notifications, counter];
  }

  async find(): Promise<ReadNotificationDTO[]> {
    const notifications = await this.notificationRepository.find({
      order: {
        id: 'DESC',
      },
    });

    return notifications.map((notification) =>
      plainToClass(ReadNotificationDTO, notification),
    );
  }

  getValuesByState(state: string): {
    title: string;
    topic: string;
  } {
    let title = '',
      topic = '';
    if (state === 'creado') {
      title = 'Transaccion creada';
      topic = 'created';
    } else if (state === 'inventariado') {
      title = 'Transaccion en bodega';
      topic = 'inventoried';
    } else if (state === 'procesando') {
      title = 'Transaccion en espera';
      topic = 'processing';
    } else if (state === 'completado') {
      title = 'Transaccion completada';
      topic = 'complete';
    } else if (state === 'devuelto') {
      title = 'Transaccion devuelta';
      topic = 'returned';
    }

    return {
      title,
      topic,
    };
  }

  async deleteNotification(id: number): Promise<void> {
    const notification = await this.notificationRepository.findOneOrFail(id);
    this.gateway.wss.emit('delete-notification', notification);
    await this.notificationRepository.remove(notification);
  }
}
