import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SysModule } from './sys/sys.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from './common/logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionsFilter } from './common/http-exceptions/http-exceptions.filter';
@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('MYSQL_HOST'),
          port: config.get<number>('MYSQL_PORT'),
          username: config.get<string>('MYSQL_USERNAME'),
          password: config.get<string>('MYSQL_PASSWORD'),
          database: config.get<string>('MYSQL_DATABASE'),
          //指定 TypeORM 需要加载的实体类文件路径
          entities: [__dirname + '/**/*.entities{.ts,.js}'],
          charset: 'utf8mb4',
          //自动加载实体类
          autoLoadEntities: true,
          //自动同步数据库结构
          synchronize: true,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SysModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
