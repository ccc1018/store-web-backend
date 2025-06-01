import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SysModule } from './sys/sys.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from './common/logger/logger.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionsFilter } from './common/http-exceptions/http-exceptions.filter';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PermissionGuardGuard } from './auth/permission-guard/permission-guard.guard';
import { RoleModule } from './role/role.module';
import { MailService } from './mail/mail.service';
@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log(config.get<string>('MYSQL_HOST'));
        console.log(config.get<number>('MYSQL_PORT'));
        console.log(config.get<string>('MYSQL_USERNAME'));
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
          synchronize: false,
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.docker',
      isGlobal: true,
    }),
    SysModule,
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 应用过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    //应用拦截器
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
    //应用jwt登录状态验证守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 应用接口权限验证守卫
    {
      provide: APP_GUARD,
      useClass: PermissionGuardGuard,
    },
    MailService,
  ],
})
export class AppModule {}
