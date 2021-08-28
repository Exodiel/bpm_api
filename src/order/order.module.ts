import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
