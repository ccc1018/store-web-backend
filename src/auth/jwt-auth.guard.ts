import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_NO_TOKEN } from 'src/common/decorators/token.decorator';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //接口是否允许无 token 访问
    const allowNoToken = this.reflector.getAllAndOverride<boolean>(
      ALLOW_NO_TOKEN,
      [context.getHandler(), context.getClass()],
    );

    if (allowNoToken) return true;
    // 验证用户是否登录
    const request = context.switchToHttp().getRequest<Request>();
    const access_token = request.get('Authorization');
    if (!access_token) {
      throw new HttpException(
        '您还未登录，请先登录后在使用',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload = this.userService.verifyToken(access_token);
      if (!payload) {
        throw new HttpException(
          '登录过期，请重新登录',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return super.canActivate(context) as Promise<boolean>;
    } catch (error) {
      console.log(error);
      throw new HttpException('令牌验证失败', HttpStatus.UNAUTHORIZED);
    }
  }
}
