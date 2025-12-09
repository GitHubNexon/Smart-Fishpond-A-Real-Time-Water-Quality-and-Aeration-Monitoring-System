# System Logs Module Plan

## 1. Logs Table Structure

| Field Name    | Type                                                 | Description                                                                        |
| ------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `id`          | `uuid`                                               | Primary key. Use `@PrimaryGeneratedColumn('uuid')`                                 |
| `timestamp`   | `timestamptz`                                        | When the log was created. `@CreateDateColumn()`                                    |
| `level`       | `enum` (`'INFO', 'WARN', 'ERROR', 'DEBUG', 'TRACE'`) | Log severity level                                                                 |
| `context`     | `varchar`                                            | Optional: Module, service, or component that generated the log                     |
| `message`     | `text`                                               | Main log message content                                                           |
| `metadata`    | `jsonb`                                              | Optional: Additional structured data (e.g., request id, user id, headers, payload) |
| `userId`      | `uuid` (nullable)                                    | Optional: If the log is related to a specific user                                 |
| `ipAddress`   | `inet` (nullable)                                    | Optional: Client IP address                                                        |
| `requestPath` | `varchar` (nullable)                                 | Optional: API endpoint or route                                                    |
| `method`      | `varchar` (nullable)                                 | HTTP method if relevant (`GET`, `POST`, etc.)                                      |
| `statusCode`  | `int` (nullable)                                     | HTTP response code if applicable                                                   |
| `errorStack`  | `text` (nullable)                                    | Full stack trace for errors                                                        |
| `createdAt`   | `timestamptz`                                        | Automatically track creation time                                                  |
| `updatedAt`   | `timestamptz`                                        | Track updates if any (rare for logs, but sometimes useful)                         |

## 2. Indexing for Performance

* `timestamp` → to quickly query logs by date/time.
* `level` → for filtering by severity.
* `context` → if you often filter by module/service.
* `userId` → if user-specific logs are frequent.
* `metadata` (GIN index) → allows fast JSON queries.

Example in TypeORM:

```ts
@Index('idx_logs_metadata', { synchronize: false })
```

Manual GIN index creation:

```sql
CREATE INDEX idx_logs_metadata ON system_logs USING gin (metadata jsonb_path_ops);
```

## 3. Enum Example for Log Levels

```ts
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}
```

## 4. TypeORM Entity Example

```ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LogLevel } from './log-level.enum';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LogLevel })
  level: LogLevel;

  @Column({ nullable: true })
  context: string;

  @Column('text')
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'inet', nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  requestPath: string;

  @Column({ nullable: true })
  method: string;

  @Column({ type: 'int', nullable: true })
  statusCode: number;

  @Column({ type: 'text', nullable: true })
  errorStack: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

## 5. Scalability Notes

* **Partitioning:** Consider table partitioning by month/year in PostgreSQL for large datasets.
* **Retention:** Use cron jobs or `pg_partman` to automatically delete old logs.
* **Query Optimization:** Denormalize frequently queried metadata fields if necessary.
* **Asynchronous Logging:** Use a queue (e.g., BullMQ) to write logs without blocking requests.
