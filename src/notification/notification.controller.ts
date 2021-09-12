import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CriteriaDTO } from '../shared/dto/criteria.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiTags('notification/all')
  @ApiOperation({ description: 'Get all notifications' })
  @Get('/all')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getNotifications(@Query() criteria: CriteriaDTO, @Res() res: Response) {
    const [notifications, counter] = await this.notificationService.findAll(
      criteria,
    );

    return res.status(HttpStatus.OK).json({
      limit: criteria.limit,
      offset: criteria.offset,
      total: counter,
      data: notifications,
    });
  }

  @ApiTags('notification/delete/:id')
  @ApiOperation({ description: 'Delete notification by Id' })
  @Delete('/delete/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async deleteNotification(@Param('id') id: number, @Res() res: Response) {
    await this.notificationService.deleteNotification(id);
    return res.status(HttpStatus.OK).json({ message: 'notification deleted' });
  }
}
