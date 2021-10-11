import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Order } from '../order/order.entity';
import { PassportModule } from '@nestjs/passport';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [NotificationService, AppGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule { }
