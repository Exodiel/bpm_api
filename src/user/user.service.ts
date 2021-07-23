import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { ReadUserDto } from './dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { merge } from 'lodash';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async createUser(user: CreateUserDto): Promise<ReadUserDto> {
        const newUser: User = await this.userRepository.create(user);

        await this.userRepository.save(newUser);

        return plainToClass(ReadUserDto, newUser);
    }

    async findAll(): Promise<ReadUserDto[]> {
        let users: User[] = await this.userRepository.find();

        return users.map(user => plainToClass(ReadUserDto, user));
    }

    async getUserById(id: number): Promise<ReadUserDto> {
        let user: User = await this.userRepository.findOneOrFail(id);

        return plainToClass(ReadUserDto, user);
    }

    async getUserByEmail(email: string): Promise<ReadUserDto> {
        let user: User = await this.userRepository.findOneOrFail({
            where: {
                email
            }
        });

        return plainToClass(ReadUserDto, user);
    }

    async getUserByIdentification(identification: string): Promise<ReadUserDto> {
        let user: User = await this.userRepository.findOneOrFail({
            where: {
                identification
            }
        });

        return plainToClass(ReadUserDto, user);
    }

    async updateUser(id: number, userDto: UpdateUserDto): Promise<ReadUserDto> {
        let user: User = await this.userRepository.findOneOrFail(id);

        await this.userRepository.save(merge(user, userDto));

        user = await this.userRepository.findOneOrFail(id);

        return plainToClass(ReadUserDto, user);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
