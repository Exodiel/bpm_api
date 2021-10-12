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
import { CriteriaReportDto } from './dto/criteria-report.dto';
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

  @ApiTags('order/find')
  @ApiOperation({ description: 'Get all orders without paging' })
  @Get('/find')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async find(@Res() res: Response) {
    const orders = await this.orderService.find();

    return res.status(HttpStatus.OK).json(orders);
  }

  @ApiTags('order/create')
  @ApiOperation({ description: 'Create an order' })
  @Post('/create')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async saveOrder(@Body() orderDto: CreateOrderDto, @Res() res: Response) {
    console.log(orderDto);
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

  @ApiTags('order/find-totals-by-month')
  @ApiOperation({ description: 'Get totals grouping by month' })
  @Get('/find-totals-by-month/:type/:state')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async findTotal(
    @Param('type') type: string,
    @Param('state') state: string,
    @Res() res: Response,
  ) {
    const data = await this.orderService.findTotalByMonth(type, state);

    return res.status(HttpStatus.OK).json({
      data,
    });
  }

  @ApiTags('order/get-counters')
  @ApiOperation({ description: 'Get counters by state' })
  @Get('/get-counters/:type')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getCounters(@Param('type') type: string, @Res() res: Response) {
    const data = await this.orderService.getCountersByState();

    return res.status(HttpStatus.OK).json({
      data,
    });
  }

  @ApiTags('order/get-total-month/:type/:state')
  @ApiOperation({ description: 'Get total month by type and state' })
  @Get('/get-total-month/:type/:state')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getTotalMonth(
    @Param('type') type: string,
    @Param('state') state: string,
    @Res() res: Response,
  ) {
    const data = await this.orderService.getTotalMonth(type, state);

    return res.status(HttpStatus.OK).json({
      data,
    });
  }

  @ApiTags('order/get-total-month/:type/:state')
  @ApiOperation({ description: 'Get total month by type and state' })
  @Get('/get-totals-year/:type/:state')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getTotalsYear(
    @Param('type') type: string,
    @Param('state') state: string,
    @Res() res: Response,
  ) {
    const data = await this.orderService.getTotalsByYear(type, state);

    return res.status(HttpStatus.OK).json({
      data,
    });
  }

  @ApiTags(
    'order/get-transactions?startDate=2021-09-01&endDate=2021-09-30&personId=1&type=Venta&state=completado',
  )
  @ApiOperation({ description: 'Get total month by type and state' })
  @Post('/get-transactions')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getTransactionReport(
    @Body() criteria: CriteriaReportDto,
    @Res() res: Response,
  ) {
    const data = await this.orderService.getTransactionReport(criteria);
    return res.status(HttpStatus.OK).json(data);
  }

  @ApiTags('order/get-transactions-by-user/:id')
  @ApiOperation({ description: 'Get transactions by user' })
  @Get('/get-transactions-by-user/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getTransactionByUser(
    @Param('id') userId: number,
    @Res() res: Response,
  ) {
    const data = await this.orderService.getTransactionsByUser(userId);
    return res.status(HttpStatus.OK).json(data);
  }

  @ApiTags('order/get-transactions-by-person/:id')
  @ApiOperation({ description: 'Get transactions by person' })
  @Get('/get-transactions-by-person/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async getTransactionByPerson(
    @Param('id') personId: number,
    @Res() res: Response,
  ) {
    const data = await this.orderService.getTransactionsByPerson(personId);
    return res.status(HttpStatus.OK).json(data);
  }
}
