// src/utils/services/pagination.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  Repository,
  SelectQueryBuilder,
  ObjectLiteral,
  EntityMetadata,
} from 'typeorm';

export type FilterType<T> = Partial<T> | Partial<T>[];

export interface QueryOptions<T> {
  page?: number;
  limit?: number;
  keyword?: string;
  searchableFields?: string[]; // allow relation.field too
  sortBy?: string; // allow relation.field too
  sortableFields?: string[];
  sortOrder?: 'asc' | 'desc';
  dataKey?: string;
  filters?: Record<string, any> | Record<string, any>[];
  relations?: string[]; // relations to join
  withDeleted?: boolean;
}

@Injectable()
export class PaginationService<T extends ObjectLiteral> {
  async paginate(
    repository: Repository<T>,
    alias: string,
    options: QueryOptions<T>,
  ): Promise<any> {
    const {
      page = 1,
      limit = 10,
      keyword = '',
      searchableFields = [],
      sortBy = 'createdAt',
      sortableFields = [],
      sortOrder = 'desc',
      dataKey = 'data',
      filters = {},
      relations = [],
      withDeleted = false,
    } = options;

    const metadata: EntityMetadata = repository.metadata;
    if (!metadata) throw new BadRequestException('Invalid repository metadata');

    let qb: SelectQueryBuilder<T> = repository.createQueryBuilder(alias);

    if (withDeleted) qb.withDeleted();

    // --- Auto join relations if requested (supports nested dot notation)
    relations.forEach((relationPath) => {
      const parts = relationPath.split('.');
      let joinAlias = alias;

      parts.forEach((part, i) => {
        const currentAlias = parts.slice(0, i + 1).join('_');
        const joinPath = `${joinAlias}.${part}`;

        // Only join once per alias to prevent duplicates
        if (
          !qb.expressionMap.joinAttributes.some(
            (j) => j.alias.name === currentAlias,
          )
        ) {
          qb = qb.leftJoinAndSelect(joinPath, currentAlias);
        }

        joinAlias = currentAlias;
      });
    });

    // --- Normalize filters
    const filterArray: Record<string, any>[] = Array.isArray(filters)
      ? filters
      : [filters];

    /** IN is not used for enums 
    filterArray.forEach((filterObj) => {
      Object.entries(filterObj).forEach(([field, value]) => {
        if (value === undefined || value === null) return;

        if (field.includes('.')) {
          // relation.field
          const [relation, relField] = field.split('.');
          if (!relations.includes(relation)) {
            throw new BadRequestException(
              `Relation '${relation}' must be included in 'relations'`,
            );
          }
          qb = qb.andWhere(
            `${relation}.${relField} = :${relation}_${relField}`,
            {
              [`${relation}_${relField}`]: value,
            },
          );
        } else {
          // direct column
          if (!metadata.findColumnWithPropertyName(field)) {
            throw new BadRequestException(
              `Filter field '${field}' does not exist on entity '${metadata.name}'`,
            );
          }
          qb = qb.andWhere(`${alias}.${field} = :${field}`, { [field]: value });
        }
      });
    });
    */

    filterArray.forEach((filterObj) => {
      Object.entries(filterObj).forEach(([field, value]) => {
        if (value === undefined || value === null) return;

        if (field.includes('.')) {
          // relation.field
          const [relation, relField] = field.split('.');
          if (!relations.includes(relation)) {
            throw new BadRequestException(
              `Relation '${relation}' must be included in 'relations'`,
            );
          }

          if (Array.isArray(value)) {
            qb = qb.andWhere(
              `${relation}.${relField} IN (:...${relation}_${relField})`,
              { [`${relation}_${relField}`]: value },
            );
          } else {
            qb = qb.andWhere(
              `${relation}.${relField} = :${relation}_${relField}`,
              {
                [`${relation}_${relField}`]: value,
              },
            );
          }
        } else {
          // direct column
          if (!metadata.findColumnWithPropertyName(field)) {
            throw new BadRequestException(
              `Filter field '${field}' does not exist on entity '${metadata.name}'`,
            );
          }

          if (Array.isArray(value)) {
            qb = qb.andWhere(`${alias}.${field} IN (:...${field})`, {
              [field]: value,
            });
          } else {
            qb = qb.andWhere(`${alias}.${field} = :${field}`, {
              [field]: value,
            });
          }
        }
      });
    });


    if (keyword && searchableFields.length) {
      const conditions = searchableFields.map((field) => {
        if (field.includes('.')) {
          const [relation, relField] = field.split('.');
          if (!relations.includes(relation)) {
            throw new BadRequestException(
              `Relation '${relation}' must be included in 'relations'`,
            );
          }

          // Find the relation metadata to check column type
          const relationMetadata = metadata.relations.find(
            (r) => r.propertyName === relation,
          );
          if (relationMetadata) {
            const targetMetadata = relationMetadata.inverseEntityMetadata;
            const column = targetMetadata.findColumnWithPropertyName(relField);

            // Cast UUID columns to text for ILIKE
            if (column && column.type === 'uuid') {
              return `CAST(${relation}.${relField} AS TEXT) ILIKE :keyword`;
            }
          }

          return `${relation}.${relField} ILIKE :keyword`;
        }

        const column = metadata.findColumnWithPropertyName(field);
        if (!column) {
          throw new BadRequestException(
            `Searchable field '${field}' does not exist on entity '${metadata.name}'`,
          );
        }

        // Cast UUID columns to text for ILIKE
        if (column.type === 'uuid' || column.type === 'enum') {
          return `CAST(${alias}.${field} AS TEXT) ILIKE :keyword`;
        }

        return `${alias}.${field} ILIKE :keyword`;
      });

      qb = qb.andWhere(`(${conditions.join(' OR ')})`, {
        keyword: `%${keyword}%`,
      });
    }

    // --- Sorting
    if (sortBy) {
      let sortExpr = '';
      if (sortBy.includes('.')) {
        const [relation, relField] = sortBy.split('.');
        if (!relations.includes(relation)) {
          throw new BadRequestException(
            `Relation '${relation}' must be included in 'relations'`,
          );
        }
        sortExpr = `${relation}.${relField}`;
      } else {
        if (!metadata.findColumnWithPropertyName(sortBy)) {
          throw new BadRequestException(
            `Sort field '${sortBy}' does not exist on entity '${metadata.name}'`,
          );
        }
        sortExpr = `${alias}.${sortBy}`;
      }
      if (metadata.findColumnWithPropertyName('deletedAt')) {
        qb = qb.orderBy(`${alias}.deletedAt`, 'DESC');
      }

      qb = qb.addOrderBy(sortExpr, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    }

    // --- Pagination
    const totalItems = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      [dataKey]: data,
    };
  }
}
