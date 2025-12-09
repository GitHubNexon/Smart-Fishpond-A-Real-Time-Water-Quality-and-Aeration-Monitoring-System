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

@Entity('sessions')
@Index(['user', 'expiresAt'])
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user) => user.authLogs, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  device: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  expiresAt: Date; // set manually on insert (e.g., now + 1 day)
}
