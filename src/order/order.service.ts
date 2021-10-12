import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ReadOrderDto } from './dto/read-order.dto';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { plainToClass } from 'class-transformer';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CriteriaDTO } from '../shared/dto/criteria.dto';
import { AppGateway } from '../app.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './event/order-created.event';
import { OrderUpdatedEvent } from './event/order-updated.event';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Detail } from '../detail/detail.entity';
import { ReadReportDto } from './dto/read-report.dto';
import { ReadCountersDTO } from './dto/read-counters.dto';
import { getActualYear, getActualMonth } from '../utils/date-formatting';
import { CriteriaReportDto } from './dto/criteria-report.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
    private eventEmitter: EventEmitter2,
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
      personId,
      discount,
      origin,
    } = orderDto;
    const sequential = await this.generateSequential(type);
    const user: User = await this.userRepository.findOneOrFail(userId);
    const person: User = await this.userRepository.findOneOrFail(personId);

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
      person,
      sequential,
      discount,
      origin,
    });

    await this.orderRepository.save(newOrder);
    this.gateway.wss.emit('new-order', newOrder);
    const orderCreatedEvent = new OrderCreatedEvent(
      newOrder.id,
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
      personId,
      sequential,
      discount,
      origin,
    );
    this.eventEmitter.emit('order.created', orderCreatedEvent);
    return plainToClass(ReadOrderDto, newOrder);
  }

  private async generateSequential(type: string): Promise<string> {
    const orders = await this.orderRepository.find({
      where: { type },
      order: {
        id: 'DESC',
      },
      take: 1,
    });

    let sequential = '';

    if (orders.length <= 0) {
      sequential = '001-001-000000001';
    } else {
      const serie = `${
        parseInt(orders[0].sequential.split('-')[2]) + 1
      }`.padStart(9, '0');
      sequential = `001-001-${serie}`;
    }

    return sequential;
  }

  async updateOrder(
    id: number,
    orderDto: UpdateOrderDto,
  ): Promise<ReadOrderDto> {
    let order = await this.orderRepository.findOneOrFail(id, {
      relations: ['user', 'person', 'details', 'details.product'],
    });
    const {
      date,
      sequential,
      subtotal,
      total,
      tax,
      description,
      type,
      payment,
      state,
      address,
      userId,
      personId,
      discount,
    } = orderDto;
    const user: User = await this.userRepository.findOneOrFail(userId);
    const person: User = await this.userRepository.findOneOrFail(personId);
    const details = await this.detailRepository.find({
      relations: ['product', 'order'],
      where: [{ order }],
    });
    await this.detailRepository.remove(details);

    await this.orderRepository.update(id, {
      date,
      sequential,
      subtotal,
      total,
      tax,
      description,
      type,
      payment,
      state,
      address,
      discount,
      user,
      person,
    });
    order = await this.orderRepository.findOneOrFail(id, {
      relations: ['user', 'person', 'details', 'details.product'],
    });

    this.gateway.wss.emit('updated-order', order);
    return plainToClass(ReadOrderDto, order);
  }

  async updateStatus(
    id: number,
    updateStatus: UpdateStatusDto,
  ): Promise<ReadOrderDto> {
    const { state, employeeId } = updateStatus;
    await this.orderRepository.update(id, {
      state,
    });
    const order: Order = await this.orderRepository.findOneOrFail(id, {
      relations: ['user', 'person', 'details', 'details.product'],
    });

    const orderUpdatedEvent = new OrderUpdatedEvent(
      order.id,
      order.date,
      order.subtotal,
      order.tax,
      order.total,
      order.description,
      order.type,
      order.payment,
      order.state,
      order.address,
      order.user.id,
      order.person.id,
      order.sequential,
      order.discount,
      employeeId,
      order.origin,
    );

    this.gateway.wss.emit('status-updated', order);
    this.eventEmitter.emit('order.updated', orderUpdatedEvent);
    return plainToClass(ReadOrderDto, order);
  }

  async findAll(criteria: CriteriaDTO): Promise<[ReadOrderDto[], number]> {
    const [ordersFilter, counter] = await this.orderRepository.findAndCount({
      take: parseInt(criteria.limit),
      skip: parseInt(criteria.offset),
      relations: ['user', 'person', 'details', 'details.product'],
    });

    const orders = ordersFilter.map((order) =>
      plainToClass(ReadOrderDto, order),
    );

    return [orders, counter];
  }

  async find(): Promise<ReadOrderDto[]> {
    const orders = await this.orderRepository.find({
      relations: ['user', 'person', 'details', 'details.product'],
    });
    return orders.map((order) => plainToClass(ReadOrderDto, order));
  }

  async findById(id: number): Promise<ReadOrderDto> {
    const order = await this.orderRepository.findOneOrFail(id, {
      relations: ['user', 'person', 'details', 'details.product'],
    });
    return plainToClass(ReadOrderDto, order);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOneOrFail(id);
    const details = await this.detailRepository.find({
      relations: ['product', 'order'],
      where: [{ order }],
    });
    await this.detailRepository.remove(details);
    await this.orderRepository.remove(order);
  }

  async findTotalByMonth(
    type: string,
    state: string,
  ): Promise<ReadReportDto[]> {
    const raw = await this.orderRepository
      .createQueryBuilder('order')
      .select('ROUND(SUM(order.total), 2)', 'total')
      .addSelect('EXTRACT(MONTH FROM order.date)', 'month')
      .addSelect('COUNT(order.date)', 'count')
      .where('order.type = :type', { type })
      .andWhere('order.state <> :state', { state })
      .groupBy('EXTRACT(MONTH FROM order.date)')
      .orderBy('EXTRACT(MONTH FROM order.date)', 'DESC')
      .limit(4)
      .getRawMany<ReadReportDto>();

    return raw.map((el) => plainToClass(ReadReportDto, el));
  }

  async getTotalsByYear(
    type: string,
    state: string,
  ): Promise<{
    actualYear: ReadReportDto[];
    pastYear: ReadReportDto[];
  }> {
    const year = getActualYear();

    const actualYear = await this.orderRepository
      .createQueryBuilder('order')
      .select('ROUND(SUM(order.total), 2)', 'total')
      .addSelect('EXTRACT(MONTH FROM order.date)', 'month')
      .addSelect('COUNT(order.date)', 'count')
      .where('order.type = :type', { type })
      .andWhere('order.state <> :state', { state })
      .andWhere('EXTRACT(YEAR FROM order.date) = :year', { year })
      .groupBy('EXTRACT(MONTH FROM order.date)')
      .orderBy('EXTRACT(MONTH FROM order.date)', 'ASC')
      .limit(12)
      .getRawMany<ReadReportDto>();

    const pastYear = await this.orderRepository
      .createQueryBuilder('order')
      .select('ROUND(SUM(order.total), 2)', 'total')
      .addSelect('EXTRACT(MONTH FROM order.date)', 'month')
      .addSelect('COUNT(order.date)', 'count')
      .where('order.type = :type', { type })
      .andWhere('order.state <> :state', { state })
      .andWhere('EXTRACT(YEAR FROM order.date) = :year', {
        year: parseInt(year) - 1,
      })
      .groupBy('EXTRACT(MONTH FROM order.date)')
      .orderBy('EXTRACT(MONTH FROM order.date)', 'ASC')
      .limit(12)
      .getRawMany<ReadReportDto>();

    return {
      actualYear,
      pastYear,
    };
  }

  async getTotalMonth(
    type: string,
    state: string,
  ): Promise<{
    actualMonth: { total: string };
    pastMonth: { total: string };
  }> {
    const month = getActualMonth().padStart(2, '0');

    const actualMonth = await this.orderRepository
      .createQueryBuilder('order')
      .select('ROUND(SUM(order.total), 2)', 'total')
      .where('order.type = :type', { type })
      .andWhere('order.state <> :state', { state })
      .andWhere('EXTRACT(MONTH FROM order.date) = :month', { month })
      .getRawOne<{ total: string }>();

    const pastMonth = await this.orderRepository
      .createQueryBuilder('order')
      .select('ROUND(SUM(order.total), 2)', 'total')
      .where('order.type = :type', { type })
      .andWhere('order.state <> :state', { state })
      .andWhere('EXTRACT(MONTH FROM order.date) = :month', {
        month: parseInt(month) - 1,
      })
      .getRawOne<{ total: string }>();

    return {
      actualMonth,
      pastMonth,
    };
  }

  async getCountersByState(): Promise<ReadCountersDTO> {
    const raw = await this.orderRepository.query(
      'SELECT COUNT(state) AS complete, (SELECT COUNT(state) FROM "order" WHERE state = $1) AS inventoried, (SELECT COUNT(state) FROM "order" WHERE state = $2) AS processing, (SELECT COUNT(state) FROM "order" WHERE state = $3) AS returning FROM "order" WHERE state = $4',
      ['inventariado', 'procesando', 'devuelto', 'completado'],
    );

    const counters = raw[0] as ReadCountersDTO;

    return counters;
  }

  async getTransactionReport(
    criteria: CriteriaReportDto,
  ): Promise<ReadOrderDto[]> {
    let orders: Order[];
    if (
      criteria.personId == 0 &&
      criteria.state === '' &&
      criteria.type === ''
    ) {
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
        },
      });
    } else if (
      criteria.personId > 0 &&
      criteria.state === '' &&
      criteria.type === ''
    ) {
      const person = await this.userRepository.findOneOrFail(criteria.personId);
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
          person,
        },
      });
    } else if (
      criteria.personId > 0 &&
      criteria.state !== '' &&
      criteria.type === ''
    ) {
      const person = await this.userRepository.findOneOrFail(criteria.personId);
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
          person,
          state: criteria.state,
        },
      });
    } else if (
      criteria.personId > 0 &&
      criteria.state !== '' &&
      criteria.type !== ''
    ) {
      const person = await this.userRepository.findOneOrFail(criteria.personId);
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
          person,
          state: criteria.state,
          type: criteria.type,
        },
      });
    } else if (
      criteria.personId <= 0 &&
      criteria.state !== '' &&
      criteria.type !== ''
    ) {
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
          state: criteria.state,
          type: criteria.type,
        },
      });
    } else if (
      criteria.personId <= 0 &&
      criteria.state === '' &&
      criteria.type !== ''
    ) {
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
          type: criteria.type,
        },
      });
    } else if (
      criteria.personId <= 0 &&
      criteria.state !== '' &&
      criteria.type === ''
    ) {
      orders = await this.orderRepository.find({
        relations: ['user', 'person'],
        where: {
          date: Between(criteria.startDate, criteria.endDate),
          state: criteria.state,
        },
      });
    }

    return orders.map((order) => plainToClass(ReadOrderDto, order));
  }

  async getTransactionsByUser(userId: number): Promise<ReadOrderDto[]> {
    const user = await this.userRepository.findOneOrFail(userId);
    const orders = await this.orderRepository.find({
      where: [{ user }],
    });

    return orders.map((order) => plainToClass(ReadOrderDto, order));
  }

  async getTransactionsByPerson(personId: number): Promise<ReadOrderDto[]> {
    const person = await this.userRepository.findOneOrFail(personId);
    const orders = await this.orderRepository.find({
      where: [{ person }],
    });

    return orders.map((order) => plainToClass(ReadOrderDto, order));
  }
}
