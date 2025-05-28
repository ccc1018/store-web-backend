import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
} from '@nestjs/common';
import { SysService } from './sys.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AllowNoToken } from 'src/common/decorators/token.decorator';
import {
  ApiBody,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { RegistryEmailDto } from './dto/registry-email.dto';

@Controller('sys')
@ApiTags('sys')
export class SysController {
  @Inject(UserService)
  private userService: UserService;
  constructor(private readonly sysService: SysService) {}
  // 用户登录
  @Post('login')
  @AllowNoToken()
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 201, description: '用户登录成功' })
  @ApiResponse({ status: 400, description: '用户名或密码错误' })
  @ApiBody({ description: '用户登录', type: LoginUserDto })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
  @Post('registry')
  @AllowNoToken()
  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '用户名或密码错误' })
  @ApiBody({ description: '用户注册', type: CreateUserDto })
  registry(@Body() createUserDto: CreateUserDto) {
    return this.userService.registry(createUserDto);
  }
  @Get('sendEmailForRegistry')
  @AllowNoToken()
  @ApiOperation({ summary: '发送注册邮箱验证码' })
  @ApiResponse({ status: 201, description: '发送成功' })
  @ApiResponse({ status: 400, description: '发送失败' })
  @ApiQuery({ type: RegistryEmailDto })
  sendEmailForRegistry(@Query() dto: RegistryEmailDto) {
    return this.sysService.sendMailForRegistry(dto.email, '注册验证码');
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
