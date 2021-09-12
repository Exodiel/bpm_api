import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppGateway } from './app.gateway';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DetailModule } from './detail/detail.module';
import { NotificationModule } from './notification/notification.module';
import { DetailUserModule } from './detail-user/detail-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        subscribers: [__dirname + '/**/subscriber/*{.ts,.js}'],
        migrations: [__dirname + '/**/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: './migrations',
        },
        synchronize: true,
        migrationsRun: true,
        logging: true,
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthenticationModule,
    CoreModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    DetailModule,
    NotificationModule,
    DetailUserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
