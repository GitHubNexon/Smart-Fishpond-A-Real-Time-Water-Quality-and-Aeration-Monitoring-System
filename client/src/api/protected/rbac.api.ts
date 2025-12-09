'use client';
import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { GetAllList } from '@/interfaces/shared-api.interface';
import { GetAllPaginatedParams } from '@/interfaces/shared-api.interface';
import {
  getAllPaginatedRoles,
  getAllPaginatedPermission,
  RoleRequest,
  RBACResponse,
  PermissionRequest,
  UserPermissionRequest,
  RemovePermissionRequest,
  getAllPaginatedUserPermission,
  UserPermissionResponse,
} from '@/interfaces/rbac-api.interface';

// ====== ROLES ======

export async function getAllRolesList(): Promise<GetAllList> {
  return handleRequest(axios.get('/rbac/get-all-roles-list'));
}

export async function getAllRolesPaginated(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedRoles> {
  return handleRequest(
    axios.get('/rbac/get-all-roles', {
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

export async function createRole(
  createRoleRequest: RoleRequest,
): Promise<RBACResponse> {
  return handleRequest(axios.post('/rbac/create-role', createRoleRequest));
}

export async function updateRole(
  id: string,
  updateRoleRequest: Partial<RoleRequest>,
): Promise<RBACResponse> {
  return handleRequest(
    axios.patch(`/rbac/update-role/${id}`, updateRoleRequest),
  );
}

export async function softDeleteRole(id: string): Promise<{ message: string }> {
  return handleRequest(axios.post(`/rbac/soft-delete-role/${id}`));
}

export async function RecoverRole(id: string): Promise<{ message: string }> {
  return handleRequest(axios.post(`/rbac/recover-role/${id}`));
}

export async function softDeletePermission(
  id: string,
): Promise<{ message: string }> {
  return handleRequest(axios.post(`/rbac/soft-delete-permission/${id}`));
}

export async function RecoverPermission(
  id: string,
): Promise<{ message: string }> {
  return handleRequest(axios.post(`/rbac/recover-permission/${id}`));
}

// ====== PERMISSION ======

export async function createPermission(
  permissionRequest: PermissionRequest,
): Promise<RBACResponse> {
  return handleRequest(
    axios.post('/rbac/create-permission', permissionRequest),
  );
}

export async function updatePermission(
  id: string,
  updatePermissionRequest: PermissionRequest,
): Promise<RBACResponse> {
  return handleRequest(
    axios.patch(`/rbac/update-permission/${id}`, updatePermissionRequest),
  );
}

export async function getAllPermissionPaginated(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedPermission> {
  return handleRequest(
    axios.get('/rbac/get-all-permissions', {
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

export async function createUserPermission(
  userPermissionRequest: UserPermissionRequest,
): Promise<RBACResponse> {
  return handleRequest(
    axios.post('/rbac/assign-permissions', userPermissionRequest),
  );
}

export async function removeUserPermission(
  userId: string,
  removePermissionRequest: RemovePermissionRequest,
): Promise<RBACResponse> {
  return handleRequest(
    axios.post(`/rbac/remove-permissions/${userId}`, removePermissionRequest),
  );
}

export async function getAllUserPermissionPaginated(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedUserPermission> {
  return handleRequest(
    axios.get('/rbac/get-all-user-permissions', {
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

export async function getAllPermissionList(): Promise<GetAllList>{
  return handleRequest(axios.get('/rbac/get-all-permission-list'))
}

export async function getUserPermissionsByUserId(
  userId: string,
): Promise<UserPermissionResponse> {
  return handleRequest(axios.get(`/rbac/user-permissions/${userId}`));
}