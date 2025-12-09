# Pagination Service Usage Guide

This guide explains how to use the custom `PaginationService` built for TypeORM in NestJS. It provides a unified way to handle pagination, keyword search, sorting, filtering, and relations (similar to `populate` in Mongoose).

---

## 1. Service & Module Setup

```ts
// src/utils/services/pagination.service.ts
@Injectable()
export class PaginationService<T extends ObjectLiteral> { ... }

// src/utils/modules/pagination.module.ts
@Module({
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
```

Then import `PaginationModule` in your `SharedModule` (so you don’t need to re-import it everywhere).

```ts
// src/shared/shared.module.ts
@Module({
  imports: [PaginationModule],
  providers: [...],
  exports: [PaginationModule, ...],
})
export class SharedModule {}
```

---

## 2. QueryOptions Parameters

The `paginate` method accepts the following options:

| Option             | Type                   | Description                                                                   |                                                                                                                                                      |
| ------------------ | ---------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`             | `number`               | Current page (default `1`)                                                    |                                                                                                                                                      |
| `limit`            | `number`               | Items per page (default `10`)                                                 |                                                                                                                                                      |
| `keyword`          | `string`               | Keyword to search across `searchableFields`                                   |                                                                                                                                                      |
| `searchableFields` | `string[]`             | Fields that are searchable                                                    |                                                                                                                                                      |
| `sortBy`           | `string`               | Field to sort by (default `createdAt`)                                        |                                                                                                                                                      |
| `sortableFields`   | `string[]`             | Allowed fields for sorting (prevents SQL injection)                           |                                                                                                                                                      |
| `sortOrder`        | \`'asc'                | 'desc'\`                                                                      | Sort direction (default `desc`)                                                                                                                      |
| `dataKey`          | `string`               | Response key for results (default `data`)                                     |                                                                                                                                                      |
| `filters`          | \`Record\<string, any> | Array\<Record\<string, any>>\`                                                | Filters to apply. Can be a key-value object (e.g., `{ isActive: true }`) or an array of such objects (`[{ isActive: true }, { isConfirmed: true }]`) |
| `relations`        | `string[]`             | Entities/tables to join. At least **one relation or base entity must exist**. |                                                                                                                                                      |

### Error Handling

* If a field in `searchableFields`, `sortableFields`, or `filters` does not exist in the selected table(s), the service will throw a `BadRequestException` (from `@nestjs/common`).
* If `relations` contains a non-existent entity/table, a `BadRequestException` will also be thrown.

---

## 3. Example Usage in a Service

```ts
// users.service.ts
async getAllUsers(
  page?: number,
  limit?: number,
  keyword?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
) {
  return this.paginationService.paginate(this.userRepository, 'user', {
    page: page || 1,
    limit: limit || 10,
    keyword: keyword || '',
    searchableFields: ['username', 'email', 'fullname'],
    sortableFields: ['username', 'email', 'createdAt'],
    sortBy: sortBy?.trim() || 'createdAt',
    sortOrder: sortOrder || 'desc',
    dataKey: 'users',
    relations: [], // No relations yet; can add ['userSessions', 'userLogs'] later
    filters: {}, // Can pass { isActive: true , isConfirmed: true } or {} for no filters 

    // filter also can pass any type of json field like string, boolean, number but it's meant to be to used for boolean objects for filtering
  });
}
```

---

## 4. Example Controller Endpoint

```ts
@Get('get-all')
async getAllUsers(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('keyword') keyword?: string,
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  const result = await this.userService.getAllUsers(
    page ? parseInt(page, 10) : undefined,
    limit ? parseInt(limit, 10) : undefined,
    keyword,
    sortBy,
    sortOrder,
  );

  return {
    status: 'success',
    message: 'Users fetched successfully',
    ...result,
  };
}
```

---

## 5. Example Response

```json
{
  "status": "success",
  "message": "Users fetched successfully",
  "totalItems": 120,
  "totalPages": 12,
  "currentPage": 1,
  "users": [
    {
      "id": "uuid-123",
      "username": "johnmark",
      "email": "test@email.com",
      "sessions": [
        { "id": "s1", "sessionToken": "xxx" }
      ],
      "logs": [
        { "id": "l1", "action": "LOGIN" }
      ]
    }
  ]
}
```

---

## 6. Key Benefits

* Works with **any entity/repository** in TypeORM.
* Flexible **filters** as key-value objects or array of objects.
* Supports **keyword search** across multiple fields.
* Restricts **sortable fields** for safety.
* Works like Mongoose `populate` using `relations`.
* Customizable `dataKey` for different entities (`users`, `employees`, `logs`).
* Built-in **error handling**: throws if invalid fields or relations are provided.
