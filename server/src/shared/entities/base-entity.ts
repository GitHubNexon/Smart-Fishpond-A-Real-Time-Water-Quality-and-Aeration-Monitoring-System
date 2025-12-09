// shared/base-entity-with-dates.ts
import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  VersionColumn,
  DeleteDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';

export abstract class BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @VersionColumn({ name: 'version', nullable: true })
  version: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    transformer: DateTimeTransformer,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    transformer: DateTimeTransformer,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  deletedAt?: Date;
}
