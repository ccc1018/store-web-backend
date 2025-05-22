import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { SysService } from './sys.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('sys')
export class SysController {
  @Inject(UserService)
  private userService: UserService;
  constructor(private readonly sysService: SysService) {}
  // 用户登录
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  @Post('registry')
  registry(@Body() createUserDto: CreateUserDto) {
    return this.userService.registry(createUserDto);
  }
  @Get()
  findAll() {
    return this.sysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysService.findOne(+id);
  }
}
