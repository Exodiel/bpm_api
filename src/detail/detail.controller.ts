import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/create-detail.dto';

@Controller('detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @ApiTags('detail/create')
  @ApiOperation({ description: 'Create details' })
  @Post('/create')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async saveDetails(
    @Body('data') detailsDto: CreateDetailDto[],
    @Res() res: Response,
  ) {
    console.log(detailsDto);
    await this.detailService.createDetails(detailsDto);

    return res.status(HttpStatus.CREATED).json({ message: 'details created' });
  }

  @ApiTags('detail/order/:id')
  @ApiOperation({ description: 'Get details By OrderId' })
  @Get('/order/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async findDetailsByOrder(@Param('id') orderId: number, @Res() res: Response) {
    const details = await this.detailService.getDetailsByOrder(orderId);

    return res.status(HttpStatus.CREATED).json(details);
  }
}
