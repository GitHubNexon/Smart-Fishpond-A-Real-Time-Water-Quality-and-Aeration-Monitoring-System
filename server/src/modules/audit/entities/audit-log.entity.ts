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

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  //transaction ID for every API Call or logical operations
  @Column({ type: 'text', nullable: true })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  title: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'performed_by' })
  performedBy?: User;

  @Column({ type: 'text' })
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'RECOVER'
    | 'VERIFIED'
    | 'APPROVED'
    | 'RECOVERED';

  // @CreateDateColumn({ name: 'created_at' })
  // createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  before: Record<string, any> | null; // Previous state

  @Column({ type: 'jsonb', nullable: true })
  after: Record<string, any> | null; // New state
}
