import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('store_role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, comment: '角色名称' })
  name: string;
  @Column({ type: 'varchar', length: 200, comment: '角色描述' })
  desc: string;
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date;
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updateTime: Date;
  @Column({ type: 'int', default: 0, comment: '是否为系统内置 0 否 1 是' })
  isSystem: number; // 是否是系统角色
}
