import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeORMExceptionFilter } from './filters/typeorm-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
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

  console.log('process.env.PORT', process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
