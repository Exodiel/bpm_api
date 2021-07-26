import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReadCategoryDto } from './dto/read-category.dto';


@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) { }

    async createCategory(categoryDto: CreateCategoryDto): Promise<ReadCategoryDto> {
        const newCategory: Category = await this.categoryRepository.create(categoryDto);

        await this.categoryRepository.save(newCategory);

        return plainToClass(ReadCategoryDto, newCategory);
    }

    async findAll(): Promise<ReadCategoryDto[]> {
        let categories: Category[] = await this.categoryRepository.find();

        return categories.map(category => plainToClass(ReadCategoryDto, category));
    }

    async findById(id: number): Promise<ReadCategoryDto> {
        let category: Category = await this.categoryRepository.findOneOrFail(id);

        return plainToClass(ReadCategoryDto, category);
    }

    async updateCategory(id: number, categoryDto: CreateCategoryDto): Promise<ReadCategoryDto> {
        await this.categoryRepository.update(id, categoryDto);

        let category: Category = await this.categoryRepository.findOneOrFail(id);

        return plainToClass(ReadCategoryDto, category);
    }

    async deleteCategory(id: number): Promise<void> {
        await this.categoryRepository.findOneOrFail(id);
        await this.categoryRepository.delete(id);
    }
}
