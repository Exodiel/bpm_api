import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { Notification } from '../notification/notification.entity';
import { DetailUser } from '../detail-user/detail-user.entity';
import { AppGateway } from '../app.gateway';
import { OrderCreatedListener } from './listener/order-created.listener';
import { OrderUpdatedListener } from './listener/order-updated.listener';
import { NotificationService } from '../notification/notification.service';
import { DetailUserService } from '../detail-user/detail-user.service';
import { DetailService } from '../detail/detail.service';
import { Detail } from '../detail/detail.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      Notification,
      DetailUser,
      Detail,
      Product,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    OrderService,
    AppGateway,
    OrderCreatedListener,
    OrderUpdatedListener,
    NotificationService,
    DetailUserService,
    DetailService,
  ],
  controllers: [OrderController],
})
export class OrderModule { }
