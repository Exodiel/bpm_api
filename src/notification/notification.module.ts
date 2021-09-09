import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { User } from '../user/user.entity';
import { AppGateway } from '../app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  providers: [NotificationService, AppGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
