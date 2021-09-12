import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';
import { Detail } from './detail.entity';
import { Order } from '../order/order.entity';
import { CreateDetailDto } from './dto/create-detail.dto';
import { ReadDetailDto } from './dto/read-detail.dto';
import { plainToClass } from 'class-transformer';

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
      const {
        productId,
        price,
        discount,
        discountvalue,
        subtotal,
        quantity,
        orderId,
      } = detail;
      const product = await this.productRepository.findOneOrFail(productId);
      const order = await this.orderRepository.findOneOrFail(orderId);
      const newDetail = await this.detailRepository.create({
        price,
        discount,
        discountvalue,
        subtotal,
        quantity,
        product,
        order,
      });

      await this.detailRepository.save(newDetail);
    });
  }

  async getDetailsByOrder(orderId: number): Promise<ReadDetailDto[]> {
    const order = await this.orderRepository.findOneOrFail(orderId);
    const details = await this.detailRepository.find({
      where: [{ order }],
      relations: ['product'],
    });
    return details.map((detail) => plainToClass(ReadDetailDto, detail));
  }

  async updateStock(state: string, orderId: number) {
    const order = await this.orderRepository.findOneOrFail(orderId);
    const details = await this.detailRepository.find({
      relations: ['product'],
      where: [{ order }],
    });
    if (state === 'completado') {
      details.forEach(async (detail) => {
        const newStock = detail.product.stock - detail.quantity;
        await this.productRepository.update(detail.product.id, {
          stock: newStock,
        });
      });
    }
    if (state === 'devuelto') {
      details.forEach(async (detail) => {
        const newStock = detail.product.stock + detail.quantity;
        await this.productRepository.update(detail.product.id, {
          stock: newStock,
        });
      });
    }
  }
}
