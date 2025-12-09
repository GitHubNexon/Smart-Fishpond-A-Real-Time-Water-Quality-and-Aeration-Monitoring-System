export interface UserData {
  id: string;
  fullname: string;
  profileImage: string;
  email: string;
  password: string;
  failedAttempts: number;
  lockoutUntil: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
}

export interface Roles {
  id: string;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
}

export interface Permissions {
  id: string;
  permission: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
}

export interface UserPermissions {
  id: string;
  userId: string;
  user: UserData;
  permissions: Permissions;
  permissionId: string;
  roleId: Roles;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
}

export interface UserPermissionResponse {
  status: string;
  message: string;
  data: UserPermissions;
}

export interface getAllPaginatedRoles {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  roles_data: Roles[];
}

export interface RoleRequest {
  role: string;
  description: string;
}

export interface RBACResponse {
  status: string;
  message: string;
  data: any;
}

export interface PermissionRequest {
  permission: string;
  description: string;
}

export interface getAllPaginatedPermission {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  permission_data: Permissions[];
}

export interface UserPermissionRequest {
  userId: string;
  permissionIds: string[];
}

export interface RemovePermissionRequest {
  permissionIds: string[];
}

export interface getAllPaginatedUserPermission {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  user_permissions_data: UserPermissions[];
}
