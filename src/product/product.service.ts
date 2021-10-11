import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Category } from '../category/category.entity';
import { CriteriaDTO } from '../shared/dto/criteria.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { Product } from './product.entity';
import { CriteriaReportDto } from './dto/criteria-report.dto';
import { ReadProductReportDto } from './dto/read-report.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(criteria: CriteriaDTO): Promise<[ReadProductDto[], number]> {
    const [productsFilter, counter] = await this.productRepository.findAndCount(
      {
        take: parseInt(criteria.limit),
        skip: parseInt(criteria.offset),
        relations: ['category'],
      },
    );

    const products = productsFilter.map((product) =>
      plainToClass(ReadProductDto, product),
    );

    return [products, counter];
  }

  async find(): Promise<ReadProductDto[]> {
    const products = await this.productRepository.find({
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

  async getProductReportProfitFormat(
    criteria: CriteriaReportDto,
  ): Promise<ReadProductDto[]> {
    let products: Product[];
    if (criteria.categoryId <= 0) {
      products = await this.productRepository.find({
        relations: ['category'],
      });
    } else {
      const category = await this.categoryRepository.findOneOrFail(
        criteria.categoryId,
      );
      products = await this.productRepository.find({
        relations: ['category'],
        where: [{ category }],
      });
    }

    return products.map((product) => plainToClass(ReadProductDto, product));
  }

  async getProductReportSellingFormat(criteria: CriteriaReportDto) {
    let report: ReadProductReportDto[] = [];
    if (
      criteria.startDate == '' &&
      criteria.endDate == '' &&
      criteria.categoryId <= 0
    ) {
      report = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.details', 'detail')
        .leftJoin('detail.order', 'order')
        .select([
          'product.name',
          'product.stock',
          'product.cost',
          'product.price',
        ])
        .addSelect('ROUND(SUM(order.total), 2)', 'total')
        .groupBy('product.id')
        .getRawMany();
    } else if (
      criteria.startDate != '' &&
      criteria.endDate != '' &&
      criteria.categoryId <= 0
    ) {
      report = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.details', 'detail')
        .leftJoin('detail.order', 'order')
        .select([
          'product.name',
          'product.stock',
          'product.cost',
          'product.price',
        ])
        .addSelect('ROUND(SUM(order.total), 2)', 'total')
        .addSelect('category.name', 'name')
        .where('order.date BETWEEN :start AND :end', {
          start: criteria.startDate,
          end: criteria.endDate,
        })
        .groupBy('product.id')
        .getRawMany();
    } else if (
      criteria.startDate != '' &&
      criteria.endDate != '' &&
      criteria.categoryId >= 0
    ) {
      report = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.details', 'detail')
        .leftJoin('detail.order', 'order')
        .select([
          'product.name',
          'product.stock',
          'product.cost',
          'product.price',
        ])
        .addSelect('ROUND(SUM(order.total), 2)', 'total')
        .where('order.date BETWEEN :start AND :end', {
          start: criteria.startDate,
          end: criteria.endDate,
        })
        .andWhere('category.id = :id', { id: criteria.categoryId })
        .groupBy('product.id')
        .getRawMany();
    } else if (
      criteria.startDate == '' &&
      criteria.endDate == '' &&
      criteria.categoryId >= 0
    ) {
      report = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.details', 'detail')
        .leftJoin('detail.order', 'order')
        .select([
          'product.name',
          'product.stock',
          'product.cost',
          'product.price',
        ])
        .addSelect('ROUND(SUM(order.total), 2)', 'total')
        .where('category.id = :id', { id: criteria.categoryId })
        .groupBy('product.id')
        .getRawMany();
    }
    return report;
  }

  async getProductsByCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneOrFail(categoryId);
    const products = await this.productRepository.find({
      where: [{ category }],
    });
    return products.map((product) => plainToClass(ReadProductDto, product));
  }
}
