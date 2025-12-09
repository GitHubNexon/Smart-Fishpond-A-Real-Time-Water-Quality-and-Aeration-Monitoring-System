// shared/base-entity-with-dates.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DateTimeTransformer } from './date-time.transformer';

export abstract class BaseEntityWithDates {
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
}
