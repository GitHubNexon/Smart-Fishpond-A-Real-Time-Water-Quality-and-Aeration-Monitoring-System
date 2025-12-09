production branch

```bash
psql   
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  --host=ep-quiet-sky-a1y13d64.ap-southeast-1.aws.neon.tech \
  --port=5432 \
  --username=neondb_owner \
  --dbname=template_db \
  --file="C:/personal_projects/next-nest-psql/dump/local_template_db.sql"
```



```bash
psql \
  --host=ep-quiet-sky-a1y13d64.ap-southeast-1.aws.neon.tech \
  --port=5432 \
  --username=neondb_owner \
  --dbname=rvtm_ams_db \
        --file="C:/projects/RVTM_AIMS/dump/local_db.sql"
```

```bash

psql \
  --host=dpg-d3oouuu3jp1c739km38g-a.singapore-postgres.render.com \
  --port=5432 \
  --username=render_pgsql_owner \
  --dbname=rvtm_ams_db \
  --set=sslmode=require \
  -f "C:/personal_projects/RVTM_AIMS/dump/local_db.sql"

```
how to import data

it ask to password:

neon password

npg_MjtfDYha95pR

supabasepassword
@#supabasejayem28


```bash
# Step 1️: Backup your live database

pg_dump --host=ep-quiet-sky-a1y13d64.ap-southeast-1.aws.neon.tech \
        --port=5432 \
        --username=neondb_owner \
        --dbname=rvtm_ams_db \
        --file="C:/projects/RVTM_AIMS/dump/live_template_db.sql"
```

```bash
# Step 1️: Backup your local database

pg_dump --host=localhost \
        --port=5432 \
        --username=postgres \
        --dbname=rvtm_ams_db \
        --file="C:/personal_projects/RVTM_AIMS/dump/local_db.sql"
```



```bash
# Generate a migration from root project of the server
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./migrations/Updated -d ./src/data-source.ts

```

```md
# explanation
Explanation:

npx typeorm → runs TypeORM CLI.

migration:generate → generates a new migration file automatically based on differences between your entities and the database.

-n AddUserAgeColumn → name of the migration (you can call it anything meaningful).

Result: TypeORM creates a file in your src/migration folder like 168364_add_user_age_column.ts.

```

```bash
# Generate a migration from root project of the server
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts

```

```md

Generating migrations → local DB (set .env to local)

Running migrations → live DB (set .env to Neon / production)

```