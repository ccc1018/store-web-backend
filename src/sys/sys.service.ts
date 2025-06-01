import { Inject, Injectable } from '@nestjs/common';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { RedisService } from 'src/common/redis/redis.service';
import { getRediKey } from 'src/common/utils';
import { MailService } from 'src/mail/mail.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SysService {
  @Inject(MailService)
  private mailService: MailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;
  /**
   *
   * @param email 邮箱地址
   * @param text 邮件内容
   * @returns  返回邮件发送结果
   */
  async sendMailForRegistry(email: string, text: string) {
    const { code } = (await this.mailService.sendMail(email, text)) as {
      code: string;
    };
    const redisKey = getRediKey(RedisKeyPrefix.REGISTRY_CODE, email);
    await this.redisService.set(redisKey, code, 60 * 5);
    return '验证码已发送至邮箱，请注意查收';
  }
  findAll() {
    return `This action returns all sys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sy`;
  }
}
