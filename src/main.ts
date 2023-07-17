import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConsoleLogger} from "@nestjs/common";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  });
  app.setGlobalPrefix('/api');
  await app.listen(PORT, () => {
    console.log(`Server is started - http://localhost:${PORT}`);
  });
}
bootstrap();