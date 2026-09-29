import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Global Validation Pipe ───────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // buang field yang tidak ada di DTO
      forbidNonWhitelisted: true, // lempar error jika ada field asing
      transform: true,          // auto-transform payload ke tipe DTO
    }),
  );

  // ─── Swagger / OpenAPI Setup ──────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GarasiNugi API')
    .setDescription(
      'REST API untuk platform e-commerce sparepart kendaraan GarasiNugi. ' +
      'Dokumentasi mencakup autentikasi, manajemen produk, keranjang, dan pemesanan.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Masukkan JWT token. Contoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        in: 'header',
      },
      'JWT-Auth', // nama key ini dipakai di @ApiBearerAuth('JWT-Auth') pada controller
    )
    .addTag('Auth', 'Registrasi, login, dan manajemen profil pengguna')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // token tersimpan saat refresh halaman
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`\n🚀 Application running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📄 Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/api/docs\n`);
}
void bootstrap();
