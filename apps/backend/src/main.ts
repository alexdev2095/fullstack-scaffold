import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors();

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 🔥 SWAGGER CONFIGURATION
  const config = new DocumentBuilder()
    .setTitle('Warehouse Management API')
    .setDescription(
      'Complete API for managing warehouses, products, locations and inventory',
    )
    .setVersion('1.0')
    .addTag('products', 'Product management operations')
    .addTag('warehouses', 'Warehouse management operations')
    .addTag('locations', 'Location and inventory management')
    .addBearerAuth() // Si usas autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configuración personalizada de Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Warehouse API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .topbar { background-color: #4f46e5; }
      .swagger-ui .info hgroup.main a { display: none; }
      .swagger-ui .btn.authorize { background-color: #4f46e5; border-color: #4f46e5; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
