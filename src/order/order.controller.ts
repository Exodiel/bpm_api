import {
  Body,
  Controller,
  Delete,
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
import { CriteriaDTO } from '../shared/dto/criteria.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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

  @ApiTags('order/delete/:id')
  @ApiOperation({ description: 'Delete order by id' })
  @Delete('/delete/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Param('id') id: number, @Res() res: Response) {
    await this.orderService.deleteOrder(id);

    return res.status(HttpStatus.OK).json({ message: 'order deleted' });
  }

  @ApiTags('order/:id')
  @ApiOperation({ description: 'Get order by id' })
  @Get('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: number, @Res() res: Response) {
    const order = await this.orderService.findById(id);

    return res.status(HttpStatus.OK).json(order);
  }

  @ApiTags('order/update/:id')
  @ApiOperation({ description: 'Update order by id' })
  @Put('/update/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updateOrder(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const order = await this.orderService.updateOrder(id, updateOrderDto);

    return res.status(HttpStatus.OK).json(order);
  }
}
