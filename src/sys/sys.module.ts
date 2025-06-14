import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [UserModule],
  controllers: [SysController],
  providers: [SysService, MailService],
})
export class SysModule {}
