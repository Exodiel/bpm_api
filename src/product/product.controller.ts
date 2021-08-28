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
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags('product/all')
  @ApiOperation({ description: 'Get all products' })
  @Get('/all')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() res: Response) {
    const products = await this.productService.findAll();

    return res.status(HttpStatus.OK).json(products);
  }

  @ApiTags('product/:id')
  @ApiOperation({ description: 'Get an especific product by id' })
  @Get('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number, @Res() res: Response) {
    const product = await this.productService.findById(id);

    return res.status(HttpStatus.OK).json(product);
  }

  @ApiTags('product/create')
  @ApiOperation({ description: 'Create a product' })
  @Post('/create')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.CREATED)
  async saveProduct(
    @Res() res: Response,
    @Body() productDto: CreateProductDto,
  ) {
    const product = await this.productService.createProduct(productDto);

    return res.status(HttpStatus.CREATED).json(product);
  }

  @ApiTags('product/update/:id')
  @ApiOperation({ description: 'Update a product' })
  @Put('/update/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() productDto: CreateProductDto,
  ) {
    const product = await this.productService.updateProduct(id, productDto);

    return res.status(HttpStatus.OK).json(product);
  }

  @ApiTags('product/delete/:id')
  @ApiOperation({ description: 'Delete a product by id' })
  @Delete('/delete/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Res() res: Response, @Param('id') id: number) {
    await this.productService.deleteProduct(id);

    return res.send(HttpStatus.OK);
  }
}
