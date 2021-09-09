import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { ReadNotificationDTO } from './dto/read-notification.dto';
import { Notification } from './notification.entity';
import { plainToClass } from 'class-transformer';
import { AppGateway } from '../app.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private gateway: AppGateway,
  ) {}

  async createNotification(
    notificationDTO: CreateNotificationDTO,
  ): Promise<ReadNotificationDTO> {
    const { body, data, imageUrl, title, topic, userId } = notificationDTO;
    const user: User = await this.userRepository.findOneOrFail(userId);

    const newNotification: Notification = this.notificationRepository.create({
      body,
      data,
      imageUrl,
      title,
      topic,
      user,
    });

    await this.notificationRepository.save(newNotification);
    this.gateway.wss.emit(`new-notification-${topic}`, newNotification);
    return plainToClass(ReadNotificationDTO, newNotification);
  }
}
