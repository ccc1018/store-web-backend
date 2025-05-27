import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from './common/logger/logger';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  app.useLogger(app.get(Logger));
  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true
    }),
  );
  const port = config.get<number>('APP_PORT') || 3000; // 设置默认端口为3000
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('数字门店系统 API')
    .setDescription(
      '描述：<a href="http://localhost:3000/swagger/json">默认 json 链接</a>',
    )
    .setVersion('1.0.0')
    .setOpenAPIVersion('3.1.0')
    // 添加标签
    .addTag('sys')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    // 配置 http://localhost:3000/swagger/json
    jsonDocumentUrl: 'swagger/json',
  });
  await app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/api/docs`);
  });
}
void bootstrap();
