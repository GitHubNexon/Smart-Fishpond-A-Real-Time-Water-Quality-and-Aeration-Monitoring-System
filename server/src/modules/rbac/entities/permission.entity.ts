// src/modules/rbac/entities/permission.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  DeleteDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { UserPermissions } from './user-permission.entity';

@Entity('permissions')
export class Permissions {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column({
    name: 'permission',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  permission: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: false,
    default: 'No description provided',
  })
  description: string;

  @OneToMany(
    () => UserPermissions,
    (userPermission) => userPermission.permission,
  )
  userPermissions: UserPermissions[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @VersionColumn({ name: 'version' })
  version: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
