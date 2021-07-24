import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { ReadUserDto } from './dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from '../authentication/interfaces/payload.interface';
import { hash } from 'bcrypt';

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
        
        await this.userRepository.update(id, userDto);

        let user: User = await this.userRepository.findOneOrFail(id);
        
        return plainToClass(ReadUserDto, user);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async updatePasswordUser(id: number, plainTextPassword: string): Promise<ReadUserDto> {
        
        let hashedPassword = await hash(plainTextPassword, 12);

        await this.userRepository.update(id, {
            password: hashedPassword
        });

        let user: User = await this.userRepository.findOneOrFail(id);
        
        let readUser = plainToClass(ReadUserDto, user);
        
        return readUser;
    }

    async findByPayload(payload: JwtPayload): Promise<User> {
        let user = await this.userRepository.findOneOrFail({
            id: payload.id
        });

        return user;
    }
}
