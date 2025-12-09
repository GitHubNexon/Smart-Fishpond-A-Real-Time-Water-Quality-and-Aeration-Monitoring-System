'use client';

import axios from '@/configs/axios-instance-client';
import {
  GetAllPaginatedEmployee,
  EmployeeRequest,
  EmployeeResponse,
} from './employee.interface';
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

export async function getEmployeeById(id: string): Promise<EmployeeResponse> {
  return handleRequest(axios.get(`/employee/get-employee/${id}`));
}

export async function verifyEmployee(id: string): Promise<EmployeeResponse> {
  return handleRequest(axios.post(`/employee/verify/${id}`));
}
