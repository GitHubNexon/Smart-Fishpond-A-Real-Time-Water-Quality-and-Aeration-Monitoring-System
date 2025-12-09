import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  BeforeInsert,
  ManyToOne,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from 'src/modules/users/entities/user.entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';

@Entity('auth_logs')
@Index(['user', 'timestamp'])
export class AuthLog extends BaseEntity {
  @ManyToOne(() => User, (user) => user.authLogs, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  device: string;

  @CreateDateColumn({ name: 'timestamptz', transformer: DateTimeTransformer })
  timestamp: Date;
}
