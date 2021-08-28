import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: readFileSync(`${process.cwd()}/keys/private.pem`).toString(),
      signOptions: {
        expiresIn: +process.env.JWT_EXPIRATION_TIME,
        algorithm: 'RS256',
      },
    }),
    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
