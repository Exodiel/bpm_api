import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
