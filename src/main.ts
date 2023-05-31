import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RestoMenuModule } from './resto/resto-menu/resto-menu.module';
import { UploadModule } from './resto/upload/upload.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('Module Resto Menu')
    .setDescription('Documentaion for developer 🌻')
    .setVersion('1.0')
    .addTag('Resto Menu')
    .build();
  const RestoMenu = SwaggerModule.createDocument(app, options, {
    include: [RestoMenuModule, UploadModule],
  });
  SwaggerModule.setup('api/resto-menu', app, RestoMenu);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
