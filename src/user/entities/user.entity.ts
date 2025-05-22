import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('store_user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  @Column({ type: 'varchar', length: 32, comment: '用户登录账号' })
  username: string;
  @Column()
  password: string;
  salt: string;
  userType: number;
  @Column({ type: 'varchar', comment: '用户邮箱', default: '' })
  email: string;
  freezed: number;
  avatar: string;
  desc: string;
  createTime: Date;
}
