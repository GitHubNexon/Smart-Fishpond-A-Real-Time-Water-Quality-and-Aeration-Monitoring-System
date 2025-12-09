'use client';

import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import {
  GetAllPaginatedParams,
  GetAllList,
} from '@/interfaces/shared-api.interface';
import { UserData } from '@/interfaces/user-api.interface';

export interface AuditLogs {
  id: string;
  transactionId: string;
  title: string;
  performedBy: UserData;
  action: string;
  createdAt: string;
  before: any | null;
  after: any | null;
}

export interface GetAllPaginatedAuditsLogs {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  audit_logs: AuditLogs[];
}

export async function GetAllAuditLogsPaginated(
  params: GetAllPaginatedParams,
): Promise<GetAllPaginatedAuditsLogs> {
  return handleRequest(
    axios.get('/audit/get-all-paginated', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    }),
  );
}

export async function getAuditLogsByTransaction(
  transactionId: string,
): Promise<any> {
  return handleRequest(axios.get(`/audit/get-transaction/${transactionId}`));
}
