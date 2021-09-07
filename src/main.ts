import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeORMExceptionFilter } from './filters/typeorm-exceptions.filter';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException('Validation error'),
    }),
  );
  app.enableCors();
  app.use(cookieParser());
  // app.use(helmet());
  /*app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads',
      index: false,
    },
  );*/
  const options = new DocumentBuilder()
    .setTitle('Delivery API')
    .setDescription('API for a Delivery BEM')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
