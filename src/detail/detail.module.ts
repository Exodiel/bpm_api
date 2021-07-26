import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { Detail } from './detail.entity';
import { DetailService } from './detail.service';
import { DetailController } from './detail.controller';
import { Order } from '../order/order.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Detail, Product, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [DetailService],
  controllers: [DetailController]
})
export class DetailModule { }
