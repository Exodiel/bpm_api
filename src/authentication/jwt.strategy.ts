import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { JwtPayload } from '../../dist/authentication/interfaces/payload.interface';
import { ReadUserDto } from '../user/dto/read-user.dto';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(
        `${process.cwd()}/keys/public.pem`,
      ).toString(),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<ReadUserDto> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
