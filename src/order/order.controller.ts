import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { CriteriaDTO } from 'src/shared/dto/criteria.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiTags('order/all')
  @ApiOperation({ description: 'Get all orders' })
  @Get('/all')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() criteria: CriteriaDTO, @Res() res: Response) {
    const [orders, counter] = await this.orderService.findAll(criteria);

    return res.status(HttpStatus.OK).json({
      limit: criteria.limit,
      offset: criteria.offset,
      total: counter,
      data: orders,
    });
  }

  @ApiTags('order/create')
  @ApiOperation({ description: 'Create an order' })
  @Post('/create')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async saveOrder(@Body() orderDto: CreateOrderDto, @Res() res: Response) {
    const order = await this.orderService.createOrder(orderDto);

    return res.status(HttpStatus.CREATED).json(order);
  }

  @ApiTags('order/update-state/:id')
  @ApiOperation({ description: 'Update state order by id' })
  @Put('/update-state/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updateState(
    @Param('id') id: number,
    @Body() updateStatus: UpdateStatusDto,
    @Res() res: Response,
  ) {
    const order = await this.orderService.updateStatus(id, updateStatus);

    return res.status(HttpStatus.OK).json(order);
  }
}
