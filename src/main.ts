import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription(
      `## Gestión de estrés en estudiantes 
...`, 
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('auth', 'Autenticación y registro de usuarios')
    .addTag('users', 'Gestión de usuarios y roles')
    .addTag('perfil', 'Perfil del estudiante y avatar')
    .addTag('materias', 'Materias registradas por el usuario')
    .addTag('tareas', 'Tareas y sistema de puntos de estrés')
    .addTag('hobbys', 'Hobbies del usuario')
    .addTag('colores', 'Colores disponibles para personalización')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);  
  console.log(`API corriendo en: http://localhost:${port}`);
  console.log(`Swagger Docs: http://localhost:${port}/api`);
}
bootstrap();