// src/modules/rbac/entities/user-permission.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Permissions } from './permission.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('user_permissions')
export class UserPermissions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userPermissions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Permissions, { eager: true })
  @JoinColumn({ name: 'permission_id' })
  permission: Permissions;

  @Column('uuid')
  permissionId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @VersionColumn({ name: 'version' })
  version: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
