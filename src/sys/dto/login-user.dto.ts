// Copyright 2025 CCC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: true, description: '用户名', example: 'test' })
  @IsNotEmpty({ message: '账号不能为空' })
  username: string;

  @ApiProperty({ required: true, description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(5, 20, { message: '密码长度在5-20之间' })
  password: string;
}
