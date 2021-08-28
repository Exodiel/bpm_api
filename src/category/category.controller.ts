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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiTags('category/all')
  @ApiOperation({ description: 'Get all categories' })
  @Get('/all')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() res: Response) {
    const categories = await this.categoryService.findAll();

    return res.status(HttpStatus.OK).json(categories);
  }

  @ApiTags('category/create')
  @ApiOperation({ description: 'Create a categories' })
  @UseGuards(AuthGuard())
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async saveCategory(
    @Body() categoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoryService.createCategory(categoryDto);

    return res.status(HttpStatus.CREATED).json(category);
  }

  @ApiTags('category/:id')
  @ApiOperation({ description: 'Get a category by Id' })
  @Get('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number, @Res() res: Response) {
    const category = await this.categoryService.findById(id);

    return res.status(HttpStatus.OK).json(category);
  }

  @ApiTags('category/:id')
  @ApiOperation({ description: 'Get a category by Id' })
  @Put('/update/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param('id') id: number,
    @Body() catDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const category = await this.categoryService.updateCategory(id, catDto);

    return res.status(HttpStatus.OK).json(category);
  }

  @ApiTags('category/:id')
  @ApiOperation({ description: 'Get a category by Id' })
  @Delete('/:id')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  async deleteCategory(@Param('id') id: number, @Res() res: Response) {
    await this.categoryService.deleteCategory(id);

    return res.send(HttpStatus.OK);
  }
}
