import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [SysController],
  providers: [SysService],
})
export class SysModule {}
