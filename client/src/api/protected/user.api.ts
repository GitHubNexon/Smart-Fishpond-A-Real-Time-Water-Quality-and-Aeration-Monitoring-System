'use client';

import axios from '@/configs/axios-instance-client';
import {
  getAllPaginatedUser,
  UserRequest,
  UserResponse,
} from '@/interfaces/user-api.interface';
import { GetAllList } from '@/interfaces/shared-api.interface';
import { GetAllPaginatedParams } from '@/interfaces/shared-api.interface';
import { handleRequest } from '@/configs/api.helper';

export async function GetAllUserPaginated(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedUser> {
  return handleRequest(
    axios.get('/users/get-all', {
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

export async function createUser(
  createUserRequest: UserRequest,
): Promise<UserResponse> {
  return handleRequest(axios.post('/users/create', createUserRequest));
}

export async function updateUser(
  id: string,
  updateUserRequest: Partial<UserRequest>,
): Promise<UserResponse> {
  return handleRequest(axios.patch(`/users/update/${id}`, updateUserRequest));
}

export async function softDeleteUser(id: string): Promise<{ message: string }> {
  return handleRequest(axios.post(`/users/soft-delete/${id}`));
}

export async function RecoverUser(id: string): Promise<{ message: string }> {
  return handleRequest(axios.post(`/users/recover/${id}`));
}

export async function getUserById(id: string): Promise<UserResponse> {
  return handleRequest(axios.get(`/users/get-user/${id}`));
}

export async function getAllUsersList(): Promise<GetAllList> {
  return handleRequest(axios.get('/users/get-all-users-list'));
}
