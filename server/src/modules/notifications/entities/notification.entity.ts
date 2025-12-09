import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BeforeInsert,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from 'src/modules/users/entities/user.entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';

@Entity('notifications')
export class Notifications extends BaseEntity {
  @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author' })
  author?: User;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'url_params',
    type: 'varchar',
    nullable: true,
  })
  url: string;

  @Column({ type: 'text' })
  actions: 'DONE' | 'CANCEL' | 'READ';

  @Column({ type: 'text' })
  status: 'PRIORITY' | 'ALERT' | 'NORMAL' | 'SUCCESS';

  @CreateDateColumn({ type: 'timestamptz', transformer: DateTimeTransformer })
  timestamp: Date;
}
