import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secretOrPrivateKey: readFileSync(
        `${process.cwd()}/keys/private.pem`,
      ).toString(),
      signOptions: {
        expiresIn: `60d`,
        algorithm: 'RS256',
      },
    }),
    UserModule
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
