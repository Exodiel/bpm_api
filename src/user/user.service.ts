import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ReadUserDto } from './dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from '../authentication/interfaces/payload.interface';
import { hash, compare } from 'bcrypt';
import { LoginDto } from '../authentication/dto/login.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

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
    await this.userRepository.findOneOrFail(id);
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

  async login({ email, password }: LoginDto): Promise<ReadUserDto> {
    const user = await this.userRepository.findOne({
      email
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return plainToClass(ReadUserDto, user);
  }

  async comparePasswords(userPassword: string, currentPassword: string): Promise<boolean> {
    return await compare(currentPassword, userPassword);
  }

  async getAdminUsers(): Promise<ReadUserDto[]> {
    const users = await this.userRepository.find({
      rol: 'admin'
    });

    return users.map(user => plainToClass(ReadUserDto, user));
  }
}
