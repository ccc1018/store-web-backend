import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

type JwtPayloadWithUser = JwtPayload & UserEntity;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET 未配置');
    }

    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    super(strategyOptions);
  }

  async validate(payload: JwtPayloadWithUser): Promise<UserEntity> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('账号不存在', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
