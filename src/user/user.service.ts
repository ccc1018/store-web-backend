import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from 'src/sys/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {

  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;
  login(loginUserDto: LoginUserDto) {
    return 'This action logins a user'
  }
  async registry(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;

    //1.判断用户是否存在，参数为邮箱或者用户名查询，使用createQueryBuilder一次性查询两个字段
    const user = await this.userRepository.createQueryBuilder('su')
      .where("su.username = :username OR su.email = :email", { username, email })
      .getOne();
    //2.存在则返回错误信息
    if (user) {
      throw new HttpException(
        '用户名或注册邮箱已存在，请重新输入',
        HttpStatus.CONFLICT
      )
    }
    //3.校验注册验证码
    // const codeRedDisKey = getRedisKey(

    // )
    // return {
    //   code: 200,
    //   message: '注册成功',
    //   data: user
    // }
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
