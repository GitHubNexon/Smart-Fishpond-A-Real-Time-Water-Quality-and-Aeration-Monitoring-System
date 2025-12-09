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
  OneToOne,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/entities/base-entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';

@Entity('chat_sessions')
export class ChatSession extends BaseEntity {
  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @OneToMany(() => ChatMessage, (msg) => msg.session)
  messages: ChatMessage[];
}

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @ManyToOne(() => ChatSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: ChatSession;

  @Column()
  session_id: number;

  @Column({ type: 'varchar', length: 10 })
  role: 'user' | 'assistant' | 'system';

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // e.g., source_table, snippet, token_count
}

@Entity('chat_embeddings')
export class ChatEmbedding extends BaseEntity {
  @ManyToOne(() => ChatMessage, (msg) => msg.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: ChatMessage;

  @Column()
  message_id: number;

  @Column({ type: 'text' })
  content: string; // text used to create embedding

  // CHANGED: Using JSONB instead of vector type (no pgvector needed)
  @Column({ type: 'jsonb', nullable: false })
  embedding: number[]; // stored as JSON array

  @Column({ type: 'varchar', length: 50, nullable: true })
  source_table: string; // optional, e.g., 'assets', 'issuances'

  @Column({ type: 'int', nullable: true })
  source_id: number; // optional, link to original record
}
