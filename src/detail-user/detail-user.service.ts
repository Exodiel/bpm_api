import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailUser } from './detail-user.entity';
import { ReadDetailUserDTO } from './dto/read-detailuser.dto';
import { CreateDetailUserDTO } from './dto/create-detailuser.dto';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DetailUserService {
  constructor(
    @InjectRepository(DetailUser)
    private readonly detailUserRepository: Repository<DetailUser>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(detailUserDto: CreateDetailUserDTO): Promise<ReadDetailUserDTO> {
    const { cause, userId, orderId, description } = detailUserDto;
    const user = await this.userRepository.findOneOrFail(userId);
    const order = await this.orderRepository.findOneOrFail(orderId);
    const newDetailUser = this.detailUserRepository.create({
      cause,
      description,
      user,
      order,
    });
    await this.detailUserRepository.save(newDetailUser);

    return plainToClass(ReadDetailUserDTO, newDetailUser);
  }
}
