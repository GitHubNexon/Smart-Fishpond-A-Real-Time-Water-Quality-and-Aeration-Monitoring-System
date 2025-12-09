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

@Entity('emails')
export class Mailer extends BaseEntity {
  @Column({ name: 'sender', type: 'varchar', nullable: false }) // EMAIL_USER from .env
  sender: string;

  @Column({ name: 'recepient', type: 'varchar', nullable: false }) // user.email from user database
  recepient: string;

  @Column({ name: 'subject', type: 'text', nullable: true }) // subject of the email
  subject: string;

  @Column({ name: 'body', type: 'text', nullable: false }) // html body of the email can use html and raw inline css
  body: string;

  @Column({ type: 'text', nullable: true }) // optional error message
  error_message?: string;
}
