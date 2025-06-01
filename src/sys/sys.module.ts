import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [SysController],
  providers: [SysService, MailService],
})
export class SysModule {}
