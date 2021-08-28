import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/category/category.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<ReadProductDto[]> {
    const products: Product[] = await this.productRepository.find({
      relations: ['category'],
    });

    return products.map((product) => plainToClass(ReadProductDto, product));
  }

  async findById(id: number): Promise<ReadProductDto> {
    const product: Product = await this.productRepository.findOneOrFail(id, {
      relations: ['category'],
    });

    return plainToClass(ReadProductDto, product);
  }

  async createProduct(productDto: CreateProductDto): Promise<ReadProductDto> {
    const { name, description, cost, price, stock, categoryId, image } =
      productDto;
    const category = await this.categoryRepository.findOneOrFail(categoryId);
    const newProduct: Product = await this.productRepository.create({
      name,
      description,
      cost,
      price,
      stock,
      image,
      category,
    });

    await this.productRepository.save(newProduct);

    return plainToClass(ReadProductDto, newProduct);
  }

  async updateProduct(
    id: number,
    productDto: CreateProductDto,
  ): Promise<ReadProductDto> {
    const { name, description, cost, price, stock, categoryId, image } =
      productDto;
    const category = await this.categoryRepository.findOneOrFail(categoryId);
    await this.productRepository.update(id, {
      name,
      description,
      cost,
      price,
      stock,
      image,
      category,
    });

    const product: Product = await this.productRepository.findOneOrFail(id, {
      relations: ['category'],
    });

    return plainToClass(ReadProductDto, product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.findOneOrFail(id);
    await this.productRepository.delete(id);
  }
}
