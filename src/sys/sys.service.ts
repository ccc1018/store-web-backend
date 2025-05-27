import { Injectable } from '@nestjs/common';
// import { RedisService } from 'src/common/redis/redis.service';
// import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SysService {
  // @Inject(MailService)
  // private mailService: MailService;
  // @Inject()
  // private redisService: RedisService;
  /**
   *
   * @param email 邮箱地址
   * @param text 邮件内容
   * @returns  返回邮件发送结果
   */
  sendMailForRegistry(email: string, text: string) {
    // const { code } = (await this.mailService.sendMail(email, text)) as {
    //   code: string;
    // };
    // console.log(code);
    // const redisKey = getRedisKey()
    console.log(email, text);
    return '发送成功';
  }
  findAll() {
    return `This action returns all sys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sy`;
  }
}
