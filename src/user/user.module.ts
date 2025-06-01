import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/common/redis/redis.module';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity, UserRoleEntity]),
    forwardRef(() => AuthModule),
    // 新增jwt模块
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        // 读取配置中的secret
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE_TIME'),
        },
      }),
      // 将 ConfigService 注入到工厂函数中
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
