# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/UPDATED -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
# Database Migration Workflow (TypeORM + NestJS)

This guide describes a **safe and consistent workflow** for managing database schema changes in a NestJS + TypeORM project.

---

## 🧩 Overview

Always ensure your local database matches the **latest production schema** before making any updates. This avoids migration conflicts and ensures your schema changes apply cleanly.

---

## 🧾 Step 1: Backup and Restore Production Database

1. **Export (backup) production database**

   ```bash
   pg_dump --host=PROD_HOST --port=5432 --username=postgres --dbname=prod_db --file=prod_backup.sql
   ```

2. **Restore backup locally**

   ```bash
   psql --host=localhost --username=postgres --dbname=local_db -f prod_backup.sql
   ```

✅ Now your **local DB** exactly matches the **production DB** (schema + data).

---

## 💻 Step 2: Make Schema Changes Locally

Modify your TypeORM entities in code:

* Add new tables or columns
* Update relationships
* Change constraints

These are **code-only changes** — not yet applied to any database.

---

## ⚙️ Step 3: Generate a Migration

Generate a migration file to capture the schema changes:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/AddNewTable -d ./src/data-source.ts
```

This will create a new migration file in the `/migrations` directory containing SQL operations (`CREATE TABLE`, `ALTER COLUMN`, etc.).

---

## 🧪 Step 4: Test the Migration Locally

Run your migration against your local DB:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
```

Then verify that:

* The new tables/columns exist
* The app runs correctly
* No data is lost

If anything is wrong, edit or regenerate the migration.

---

## 🚀 Step 5: Apply Migration to Production

When ready to deploy your changes:

1. **Enable maintenance mode** (optional but recommended for internal systems).

   * Temporarily disable user access to prevent writes.

2. **Deploy new code** (with the new migration file).

3. **Run migration on production**:

   ```bash
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
   ```

4. **Disable maintenance mode** once everything is verified.

✅ Production schema is now updated safely and matches your local environment.

---

## ⚠️ Important Notes

* Never run `migration:generate` directly on the production database.
* Always test migrations locally before running them live.
* Always have a production backup before migration.
* Avoid using `synchronize: true` in production — it can drop data.

---

## 🧠 Summary Table

| Step | Action                                 | Safe for Production | Notes                     |
| ---- | -------------------------------------- | ------------------- | ------------------------- |
| 1    | Backup & restore production DB locally | ✅                   | Ensures schema alignment  |
| 2    | Modify entities locally                | ✅                   | Safe, code-only changes   |
| 3    | Generate migration                     | ✅                   | Produces migration script |
| 4    | Test migration locally                 | ✅                   | Verify changes work       |
| 5    | Run migration in production            | ✅                   | Controlled schema update  |

---

## 🛠 Optional: Switching Environments

Use `.env` files to safely switch between local and production databases.

**Example:**

```env
# .env.local
DB_HOST=localhost
DB_NAME=local_db
DB_USER=postgres
DB_PASS=yourpassword

# .env.production
DB_HOST=prod_host
DB_NAME=prod_db
DB_USER=postgres
DB_PASS=prodpassword
```

And in `data-source.ts`:

```ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```


This lets you safely run:

```bash
NODE_ENV=local npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ...
NODE_ENV=production npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run ...
```
