import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ReadUserDto } from '../user/dto/read-user.dto';
import { AuthenticationService } from './authentication.service';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(
        `${process.cwd()}/keys/public.pem`,
      ).toString(),
      algorithms: ['RS256'],
      ignoreExpiration: false,
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
