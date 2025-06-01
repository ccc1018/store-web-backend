import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from 'src/sys/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/types/jwt';
import { getRediKey } from 'src/common/utils';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { RedisService } from 'src/common/redis/redis.service';
import { plainToClass } from 'class-transformer';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';
@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;
  @InjectRepository(UserRoleEntity)
  private userRoleRepository: Repository<UserRoleEntity>;

  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(DataSource)
  private dataSource: DataSource;
  constructor(private configService: ConfigService) {}
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
    });
    // 1. 判断用户是否存在
    if (!user) {
      throw new HttpException('账号或密码错误', HttpStatus.EXPECTATION_FAILED);
    }
    //2.判断密码是否正确
    const checkPasswrod = await compare(loginUserDto.password, user.password);
    if (!checkPasswrod) {
      throw new HttpException('密码错误', HttpStatus.EXPECTATION_FAILED);
    }
    //3.判断用户是否冻结
    if (user.freezed) {
      throw new HttpException(
        '账号已被冻结，请联系管理员',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    //4.生成token
    const rest = { ...user } as Omit<typeof user, 'password' | 'salt'>;
    const access_token = this.generateAccessToken(rest);
    return {
      access_token,
    };
  }
  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }
  verifyToken(token: string): JwtPayload | null {
    if (!token) return null;
    try {
      return this.jwtService.verify<JwtPayload>(token); // 直接使用注入的JwtService
    } catch (error) {
      console.error('Token验证失败:', error);
      return null;
    }
  }
  async registry(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;
    //1.判断用户是否存在，参数为邮箱或者用户名查询，使用createQueryBuilder一次性查询两个字段
    const user = await this.userRepository
      .createQueryBuilder('su')
      .where('su.username = :username OR su.email = :email', {
        username,
        email,
      })
      .getOne();
    //2.存在则返回错误信息
    if (user) {
      throw new HttpException(
        '用户名或注册邮箱已存在，请重新输入',
        HttpStatus.CONFLICT,
      );
    }
    //3.校验注册验证码
    const codeRedDisKey = getRediKey(
      RedisKeyPrefix.REGISTRY_CODE,
      createUserDto.email,
    );
    const code = await this.redisService.get(codeRedDisKey);
    console.log('注册验证码:', code);
    if (!code || code !== createUserDto.code) {
      throw new HttpException(
        '验证码错误或已过期，请重新获取',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const salt = await genSalt();
    createUserDto.password = await hash(createUserDto.password, salt);
    const newUser = plainToClass(
      UserEntity,
      { salt, ...createUserDto },
      { ignoreDecorators: true },
    );
    // 3. 不存在则创建用户
    console.log('注册用户信息:', newUser);
    const savedUser = await this.userRepository.save(newUser);
    // 4. 缓存用户信息
    const redisKey = getRediKey(RedisKeyPrefix.USER_INFO, savedUser.id);
    console.log('缓存用户信息:', redisKey);
    await this.redisService.set(
      redisKey,
      JSON.stringify(savedUser),
      60 * 60 * 24,
    ); // 缓存一天
    //5.分配当前用户默认权限
    const defaultRole = await this.dataSource
      .createQueryBuilder(RoleEntity, 'role')
      .where('role.name =:name', { name: '服务员' })
      .getOne();
    if (defaultRole) {
      await this.userRoleRepository.save({
        userId: savedUser.id,
        roleId: defaultRole.id,
      });
    }
    return {
      data: plainToClass(UserEntity, savedUser),
    };
  }
  async getCurrentUser(currentUser: UserEntity) {
    //
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });
    return user;
  }
  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findAll() {
    return `This action returns all user`;
  }
  async findOne(id: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({ id });
    console.log(user);
    if (!user) return null;
    return user;
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!existing) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.save(existing);
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
