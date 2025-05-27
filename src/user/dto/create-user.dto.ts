import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须为string类型' })
  username: string;
  @ApiProperty({ required: true, description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为string类型' })
  password: string;
  @ApiProperty({ required: true, description: '确认密码', example: '123456' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  confirmPassword: string;
  @ApiProperty({ required: true, description: '邮箱', example: '<EMAIL>' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString({ message: '邮箱必须为string类型' })
  email: string;
  @ApiProperty({ required: true, description: '验证码', example: '123456' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}
