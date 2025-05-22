import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from './common/logger/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //设置允许跨越
    cors: true,
    logger: ['error', 'warn'],
  });
  const config = app.get(ConfigService);
  // 设置 api 访问前缀
  const prefix = config.get<string>('API_PREFIX') as string;
  app.setGlobalPrefix(prefix);

  app.useLogger(app.get(Logger))
  app.useGlobalPipes(new ValidationPipe());
  const port = config.get<number>('APP_PORT') || 3000; // 设置默认端口为3000
  console.log("APP_PORT", port);
  await app.listen(port);
}
bootstrap();
