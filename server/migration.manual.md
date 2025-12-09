# Database Migration Manual with TypeORM & PostgreSQL

This manual describes how to manage database schema changes when `synchronize: false` is used in TypeORM (recommended for production). It covers migrations, alterations, and backups.

---

## 1. Prerequisites

* **TypeORM CLI** installed (`npm i -D typeorm` or included in NestJS project).
* Database (PostgreSQL) running.
* Entities defined inside your project.

Ensure `ormconfig.ts` or `AppModule` contains:

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: false,   // ❌ never in production
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,  // runs migrations automatically on app start (optional)
});
```

---

## 2. Creating a Migration

Generate a migration file based on entity changes:

```bash
npm run typeorm migration:generate -- -n CreateUsersTable
```

This command:

* Scans your entities.
* Compares them with the current DB schema.
* Creates a migration under `src/migrations/`.

Example migration file:

```ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1723456789012 implements MigrationInterface {
  name = 'CreateUsersTable1723456789012'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "full_name" character varying NOT NULL,
      "user_name" character varying NOT NULL,
      "email" character varying NOT NULL,
      "password" character varying NOT NULL,
      "user_type" character varying NOT NULL,
      "failed_attempts" integer NOT NULL DEFAULT 0,
      "lockout_until" TIMESTAMP,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "UQ_user_name" UNIQUE ("user_name"),
      CONSTRAINT "UQ_email" UNIQUE ("email"),
      CONSTRAINT "PK_users" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
```

---

## 3. Running a Migration

Apply pending migrations:

```bash
npm run typeorm migration:run
```

Revert the last executed migration:

```bash
npm run typeorm migration:revert
```

View all executed and pending migrations:

```bash
npm run typeorm migration:show
```

---

## 4. Manual Schema Alterations

If you change an entity (e.g., add a new column):

1. Update your entity class.
2. Generate a new migration:

   ```bash
   npm run typeorm migration:generate -- -n AddProfilePictureToUsers
   ```
3. Apply the migration:

   ```bash
   npm run typeorm migration:run
   ```

If needed, edit the generated migration file manually before running.

---

## 5. Database Backups (PostgreSQL)

Before applying migrations, always back up your database.

### Export backup

```bash
pg_dump -U <username> -h <host> -d <database> -F c -b -v -f backup.dump
```

### Restore backup

```bash
pg_restore -U <username> -h <host> -d <database> -v backup.dump
```

### Export as SQL script

```bash
pg_dump -U <username> -h <host> -d <database> > backup.sql
```

### Restore from SQL script

```bash
psql -U <username> -h <host> -d <database> -f backup.sql
```

---

## 6. Best Practices

* ✅ Always commit migration files to version control.
* ✅ Test migrations in staging before production.
* ✅ Run backups before applying destructive changes.
* ✅ Never enable `synchronize: true` in production.
* ✅ Use `migrationsRun: true` in AppModule if you want migrations to auto-run when the app boots.

---

## 7. Common Commands Cheat Sheet

| Action                 | Command                                                      |
| ---------------------- | ------------------------------------------------------------ |
| Generate migration     | `npm run typeorm migration:generate -- -n <Name>`            |
| Create empty migration | `npm run typeorm migration:create -- -n <Name>`              |
| Run migrations         | `npm run typeorm migration:run`                              |
| Revert last migration  | `npm run typeorm migration:revert`                           |
| Show migrations        | `npm run typeorm migration:show`                             |
| Backup DB              | `pg_dump -U user -h localhost -d dbname -F c -f backup.dump` |
| Restore DB             | `pg_restore -U user -h localhost -d dbname backup.dump`      |

---

