import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';
import { Detail } from './detail.entity';
import { Order } from '../order/order.entity';
import { CreateDetailDto } from './dto/create-detail.dto';

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createDetails(detailsDto: CreateDetailDto[]): Promise<void> {
    detailsDto.forEach(async (detail: CreateDetailDto) => {
      const { productId, price, discount, subtotal, quantity, orderId } =
        detail;
      const product = await this.productRepository.findOneOrFail(productId);
      const order = await this.orderRepository.findOneOrFail(orderId);
      const newDetail = await this.detailRepository.create({
        price,
        discount,
        subtotal,
        quantity,
        product,
        order,
      });

      await this.detailRepository.save(newDetail);
    });
  }
}
