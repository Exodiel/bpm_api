import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailUserController } from './detail-user.controller';
import { DetailUser } from './detail-user.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { DetailUserService } from './detail-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailUser, Order, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DetailUserController],
  providers: [DetailUserService],
})
export class DetailUserModule {}
