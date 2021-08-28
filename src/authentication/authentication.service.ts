import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/payload.interface';
import { ReadUserDto } from '../user/dto/read-user.dto';
import { plainToClass } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { LoginStatus } from './interfaces/logint-status.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<ReadUserDto> {
    const user = await this.userService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return plainToClass(ReadUserDto, user);
  }

  async login(loginUserDto: LoginDto): Promise<LoginStatus> {
    const user = await this.userService.login(loginUserDto);

    const token = this._createToken(user);

    return {
      user,
      ...token,
    };
  }

  async register(registerDto: RegisterDto): Promise<LoginStatus> {
    const user = await this.userService.register(registerDto);

    const token = this._createToken(user);

    return {
      user,
      ...token,
    };
  }

  private _createToken({ id }: ReadUserDto): any {
    const expiresIn = +process.env.JWT_EXPIRATION_TIME;

    const user: JwtPayload = { id };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
