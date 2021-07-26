import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/create-detail.dto';

@Controller('detail')
export class DetailController {

  constructor(
    private readonly detailService: DetailService
  ) { }

  @ApiTags('detail/create')
  @ApiOperation({ description: 'Create details' })
  @Post('/create')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async saveDetails(@Body() detailsDto: CreateDetailDto[], @Res() res: Response) {
    await this.detailService.createDetails(detailsDto);

    return res.send(HttpStatus.CREATED);
  }
}
