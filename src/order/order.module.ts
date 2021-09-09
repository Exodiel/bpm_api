import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [OrderService, AppGateway],
  controllers: [OrderController],
})
export class OrderModule {}
