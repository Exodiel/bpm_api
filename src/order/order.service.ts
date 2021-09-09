import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadOrderDto } from './dto/read-order.dto';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { plainToClass } from 'class-transformer';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CriteriaDTO } from '../shared/dto/criteria.dto';
import { AppGateway } from '../app.gateway';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private gateway: AppGateway,
  ) {}

  async createOrder(orderDto: CreateOrderDto): Promise<ReadOrderDto> {
    const {
      date,
      subtotal,
      total,
      tax,
      description,
      type,
      payment,
      state,
      address,
      userId,
    } = orderDto;
    const user: User = await this.userRepository.findOneOrFail(userId);

    const newOrder: Order = await this.orderRepository.create({
      date,
      subtotal,
      total,
      tax,
      description,
      type,
      payment,
      state,
      address,
      user,
    });

    await this.orderRepository.save(newOrder);
    this.gateway.wss.emit('new-order', newOrder);
    return plainToClass(ReadOrderDto, newOrder);
  }

  async updateStatus(
    id: number,
    updateStatus: UpdateStatusDto,
  ): Promise<ReadOrderDto> {
    const { state } = updateStatus;
    await this.orderRepository.update(id, {
      state,
    });
    const order: Order = await this.orderRepository.findOneOrFail(id, {
      relations: ['user'],
    });

    this.gateway.wss.emit('status-updated', order);

    return plainToClass(ReadOrderDto, order);
  }

  async findAll(criteria: CriteriaDTO): Promise<[ReadOrderDto[], number]> {
    const [ordersFilter, counter] = await this.orderRepository.findAndCount({
      take: parseInt(criteria.limit),
      skip: parseInt(criteria.offset),
      relations: ['user'],
    });

    const orders = ordersFilter.map((order) =>
      plainToClass(ReadOrderDto, order),
    );

    return [orders, counter];
  }
}
