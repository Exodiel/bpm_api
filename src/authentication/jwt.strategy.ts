import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(
        `${process.cwd()}/keys/public.pem`,
      ).toString(),
      algorithms: ['RS256'],
    });
    console.log(
      readFileSync(`${process.cwd()}/keys/public.pem`).toString(),
    );
  }
}
