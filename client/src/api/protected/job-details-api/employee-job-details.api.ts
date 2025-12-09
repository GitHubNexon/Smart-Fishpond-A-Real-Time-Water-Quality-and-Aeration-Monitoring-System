'use client';

import axios from '@/configs/axios-instance-client';
import {
  GetAllPaginatedJobDetails,
  JobDetailsRequest,
  JobDetailsResponse,
} from './employee-job-details.interface';
import { handleRequest } from '@/configs/api.helper';
import {
  GetAllPaginatedParams,
  GetAllList,
} from '@/interfaces/shared-api.interface';

export async function GetAllJobDetailsPaginated(
  params: GetAllPaginatedParams,
): Promise<GetAllPaginatedJobDetails> {
  return handleRequest(
    axios.get('/employee-job-details/get-all-paginated', {
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

export async function createEmployeeJobDetails(
  create: JobDetailsRequest,
): Promise<JobDetailsResponse> {
  return handleRequest(axios.post('/employee-job-details/create', create));
}

export async function updateEmployeeJobDetails(
  id: string,
  update: Partial<JobDetailsRequest>,
): Promise<JobDetailsResponse> {
  return handleRequest(
    axios.patch(`/employee-job-details/update/${id}`, update),
  );
}