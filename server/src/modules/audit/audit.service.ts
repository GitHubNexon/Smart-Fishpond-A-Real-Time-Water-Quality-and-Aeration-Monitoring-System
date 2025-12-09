// src/modules/audit/audit.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { v7 as uuidv7 } from 'uuid';
import { User } from 'src/modules/users/entities/user.entity';
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'RECOVER'
  | 'VERIFIED'
  | 'APPROVED'
  | 'RECOVERED';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    private readonly auditPaginationService: PaginationService<AuditLog>,
  ) {}

  /**
   * Log an audit record
   * @param params.transactionId - Unique transaction ID for this API call
   * @param params.title - Unique Title for Audit
   * @param params.performedBy - Current user performing action
   * @param params.action - Action type: CREATE | UPDATE | DELETE
   * @param params.before - Previous state (optional)
   * @param params.after - New state (optional)
   */
  async log({
    transactionId,
    performedBy,
    action,
    title,
    before = null,
    after = null,
  }: {
    transactionId?: string;
    title?: string;
    entityName?: string;
    entityId?: string;
    performedBy?: User;
    action: AuditAction;
    before?: Record<string, any> | Record<string, any>[] | null;
    after?: Record<string, any> | Record<string, any>[] | null;
  }) {
    const audit = this.auditRepository.create({
      id: uuidv7(),
      // transactionId: transactionId || uuidv7(),
      transactionId:
        transactionId || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      performedBy,
      title,
      action,
      before,
      after,
    });

    return this.auditRepository.save(audit);
  }

  /**
   * Log multiple audit records (for bulk operations)
   */
  async logMany({
    transactionId,
    performedBy,
    action,
    title,
    entityName,
    records,
  }: {
    transactionId?: string;
    title?: string;
    performedBy?: User;
    action: AuditAction;
    entityName?: string;
    records: {
      before?: Record<string, any> | null;
      after?: Record<string, any> | null;
    }[];
  }) {
    if (!records?.length) return [];

    const txId =
      transactionId ||
      `TX-${entityName?.toUpperCase() || 'GEN'}-${Date.now()}-${Math.floor(
        Math.random() * 1000,
      )}`;

    const logs = records.map((r) =>
      this.auditRepository.create({
        id: uuidv7(),
        transactionId: txId,
        performedBy,
        title,
        action,
        before: r.before ?? null,
        after: r.after ?? null,
      }),
    );

    return this.auditRepository.save(logs);
  }

  async getAllPaginatedAuditLogs(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};
    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }

    return this.auditPaginationService.paginate(this.auditRepository, 'audit', {
      page: page || 1,
      limit: limit || 10,
      keyword: keyword || '',
      searchableFields: [
        'performedBy.username',
        'action',
        'transactionId',
        'title',
      ],
      sortableFields: ['action'],
      sortBy: (sortBy?.trim() as keyof AuditLog) || 'createdAt',
      sortOrder: sortOrder || 'desc',
      dataKey: 'audit_logs',
      relations: ['performedBy'],
      filters: parsedFilters,
      withDeleted: true,
    });
  }

  /**
   * Fetch all audit logs for a specific transactionId (e.g., bulk ops)
   */
  async getAuditLogsByTransaction(transactionId: string) {
    return this.auditRepository.find({
      where: { transactionId },
      relations: ['performedBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
