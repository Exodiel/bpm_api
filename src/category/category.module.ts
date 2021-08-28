import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
