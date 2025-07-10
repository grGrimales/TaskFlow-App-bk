import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importar

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Habilitar CORS para que el frontend de Angular pueda hacer peticiones
  app.enableCors();

  // 2. Añadir esta línea para la validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina automáticamente las propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();