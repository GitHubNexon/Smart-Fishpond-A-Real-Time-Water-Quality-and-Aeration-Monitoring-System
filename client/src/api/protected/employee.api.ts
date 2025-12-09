'use client';

import axios from '@/configs/axios-instance-client';
import {
  GetAllPaginatedEmployee,
  EmployeeRequest,
  EmployeeResponse,
} from '@/interfaces/employee-api.interface';
import { handleRequest } from '@/configs/api.helper';
import {
  GetAllPaginatedParams,
  GetAllList,
} from '@/interfaces/shared-api.interface';

export async function GetAllEmployeePaginated(
  params: GetAllPaginatedParams,
): Promise<GetAllPaginatedEmployee> {
  return handleRequest(
    axios.get('/employee/get-all-paginated', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        ...(params.filters && { filters: JSON.stringify(params.filters) }), // filters
      },
    }),
  );
}

export async function getAllEmployeeList(
  includeEmployeeId?: string,
): Promise<GetAllList> {
  return handleRequest(
    axios.get('/employee/get-all-employee-list', {
      params: includeEmployeeId ? { includeEmployeeId } : undefined,
    }),
  );
}

export async function getAllCustodians(): Promise<GetAllList> {
  return handleRequest(axios.get('employee/custodian-list'));
}

export async function createEmployee(
  createEmployee: EmployeeRequest,
): Promise<EmployeeResponse> {
  return handleRequest(axios.post('/employee/create', createEmployee));
}

export async function updateEmployee(
  id: string,
  updateEmployee: Partial<EmployeeRequest>,
): Promise<EmployeeResponse> {
  return handleRequest(axios.patch(`/employee/update/${id}`, updateEmployee));
}

export async function softDeleteEmployee(
  id: string,
): Promise<{ message: string }> {
  return handleRequest(axios.post(`/employee/soft-delete/${id}`));
}

export async function RecoverEmployee(
  id: string,
): Promise<{ message: string }> {
  return handleRequest(axios.post(`/employee/recover/${id}`));
}

export async function getEmployeeById(id: string): Promise<EmployeeResponse> {
  return handleRequest(axios.get(`/employee/get-employee/${id}`));
}

export async function verifyEmployee(id: string): Promise<EmployeeResponse> {
  return handleRequest(axios.post(`/employee/verify/${id}`));
}

export async function bulkVerifyEmployees(ids: string[]): Promise<any> {
  return handleRequest(axios.post('/employee/bulk-verify', { ids }));
}

export async function generateEmployeeId(): Promise<any> {
  return handleRequest(axios.get(`/employee/generate-id`));
}
