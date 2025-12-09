//src/modules/rbac/rbac.service.ts

import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Permissions } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
// import { Rbac } from "./entities/rbac.entity";
import {
  CreateAccessDto,
  CreatePermissionDto,
  CreateRoleDto,
} from './dto/create-rbac.dto';
import { UpdateRoleDto, UpdatePermissionDto } from './dto/update-rbac.dto';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { PatchService } from 'src/utils/services/patch.service';
import { UserPermissions } from './entities/user-permission.entity';

/** Utilities */
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,

    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,

    @InjectRepository(UserPermissions)
    private readonly userPermissionRepository: Repository<UserPermissions>,

    private readonly patchRoleService: PatchService<Roles>,
    private readonly patchPermissionService: PatchService<Permissions>,

    private readonly rolesPaginationService: PaginationService<Roles>,
    private readonly permissionsPaginationService: PaginationService<Permissions>,
    private readonly userPermissionPaginationService: PaginationService<UserPermissions>,
  ) {}

  /** ========== ROLES ========== */
  /** Create Role */
  async createRole(createRoleDto: CreateRoleDto): Promise<Roles> {
    const { role, description } = createRoleDto;

    const existingRole = await this.roleRepository.findOne({
      where: { role },
    });
    if (existingRole) {
      throw new ConflictException(`Role "${role}" already exists`);
    }

    const newRole = this.roleRepository.create({ role, description });
    return await this.roleRepository.save(newRole);
  }

  /** Update Role */
  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ old_data: Partial<Roles>; new_data: Roles }> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not Found');

    return this.patchRoleService.patch(this.roleRepository, id, updateRoleDto, {
      patchBy: 'id',
      title: 'Role Update',
      description: `Role ${id} updated`,
      relations: [],
    });
  }

  /** soft delete role */
  async softDeleteRole(id: string): Promise<Roles> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role)
      throw new NotFoundException(
        'Role not found or Already Soft Delete / Remove',
      );

    await this.roleRepository.softRemove(role);
    return role;
  }
  /** Recover a soft delete role */
  async recoverDeleteRole(id: string): Promise<Roles> {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!role) throw new NotFoundException('Role not found');
    if (!role.deletedAt) throw new BadRequestException('Role is not deleted');

    await this.roleRepository.recover(role);
    return role;
  }

  /** GET All  */
  async getAllRolesList(): Promise<{ message: string; data: Roles[] }> {
    const roles = await this.roleRepository.find();

    return {
      message: 'Success getting all roles',
      data: roles,
    };
  }
  /** GET paginated roles */
  async getAllPaginatedRoles(
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

    return this.rolesPaginationService.paginate(this.roleRepository, 'role', {
      page: page || 1,
      limit: limit || 10,
      keyword: keyword || '',
      searchableFields: ['role', 'description'],
      sortableFields: ['role', 'createdAt'],
      sortBy: (sortBy?.trim() as keyof Roles) || 'createdAt',
      sortOrder: sortOrder || 'desc',
      dataKey: 'roles_data',
      relations: [],
      filters: parsedFilters,
      withDeleted: true,
    });
  }

  /** ========== PERMISSIONS ========== */

  /** Create Permission */
  async createPermission(
    CreatePermissionDto: CreatePermissionDto,
  ): Promise<Permissions> {
    const { permission, description } = CreatePermissionDto;

    const existingPermission = await this.permissionRepository.findOne({
      where: { permission },
    });

    if (existingPermission) {
      throw new ConflictException(`Permission "${permission}" already exists`);
    }

    const newPermission = this.permissionRepository.create({
      permission,
      description,
    });
    return await this.permissionRepository.save(newPermission);
  }

  /** Update Permision */
  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<{ old_data: Partial<Permissions>; new_data: Permissions }> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    return this.patchPermissionService.patch(
      this.permissionRepository,
      id,
      updatePermissionDto,
      {
        patchBy: 'id',
        title: 'Permission Update',
        description: `Permission ${id} updated`,
        relations: [],
      },
    );
  }
  /** soft delete Permission */
  async softDeletePermission(id: string): Promise<Permissions> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(
        'Permisson not found or Already Soft Delete / Remove',
      );

    await this.permissionRepository.softRemove(permission);
    return permission;
  }
  /** Recover a soft delete Permission */
  async recoverDeletePermission(id: string): Promise<Permissions> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!permission) throw new NotFoundException('Permission not found');
    if (!permission.deletedAt)
      throw new BadRequestException('Permission is not deleted');

    await this.permissionRepository.recover(permission);
    return permission;
  }

  /** Get All Permissions list*/
  async getAllPermissionList(): Promise<{
    message: string;
    data: Permissions[];
  }> {
    const permissions = await this.permissionRepository.find();

    return {
      message: 'Success getting all Permissions',
      data: permissions,
    };
  }

  /** GET paginated permissions */
  async getAllPaginatedPermissions(
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

    return this.permissionsPaginationService.paginate(
      this.permissionRepository,
      'permission',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: ['permission', 'description'],
        sortableFields: ['permission', 'createdAt'],
        sortBy: (sortBy?.trim() as keyof Permissions) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'permission_data',
        relations: [],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }

  /** ========== USER PERMISSION ========== */

  /** Assign permissions to user */
  async createUserPermission(dto: CreateUserPermissionDto) {
    const { userId, permissionIds } = dto;

    // Validate user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validate permissions exist
    const permissions =
      await this.permissionRepository.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('Some permissions not found');
    }

    // Check existing permissions to avoid duplicates
    const existing = await this.userPermissionRepository.find({
      where: { userId },
    });
    const existingPermissionIds = existing.map((p) => p.permissionId);

    const newUserPermissions = permissions
      .filter((p) => !existingPermissionIds.includes(p.id))
      .map((p) =>
        this.userPermissionRepository.create({
          user,
          userId,
          permission: p,
          permissionId: p.id,
        }),
      );

    return await this.userPermissionRepository.save(newUserPermissions);
  }

  /** Remove permissions from a user */
  async removeUserPermission(userId: string, permissionIds: string[]) {
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Check if all permissions exist
    const permissions =
      await this.permissionRepository.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('Some permissions not found');
    }

    //Find which permissions are actually assigned to the user
    const existingUserPermissions = await this.userPermissionRepository.find({
      where: { userId },
    });

    const existingPermissionIds = existingUserPermissions.map(
      (p) => p.permissionId,
    );

    const notAssigned = permissions
      .filter((p) => !existingPermissionIds.includes(p.id))
      .map((p) => p.permission); // names of permissions not assigned

    const toRemove = existingUserPermissions.filter((p) =>
      permissionIds.includes(p.permissionId),
    );

    // 4️⃣ Remove the permissions
    if (toRemove.length > 0) {
      await this.userPermissionRepository.remove(toRemove);
    }

    return {
      removedPermissions: toRemove.map((p) => p.permission.permission),
      notAssigned,
    };
  }

  /** GET paginated user permissions */
  async getAllPaginatedUserPermissions(
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

    return this.userPermissionPaginationService.paginate(
      this.userPermissionRepository,
      'user_permission',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: [
          'user.username',
          'user.email',
          'permission.permission',
        ],
        sortableFields: ['createdAt', 'updatedAt'],
        sortBy: (sortBy?.trim() as keyof UserPermissions) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'user_permissions_data',
        relations: ['user', 'permission'],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }

  /** Get all permissions of a user by userId */
  async getUserPermissionByUserId(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const userPermissions = await this.userPermissionRepository.find({
      where: { userId },
      relations: ['permission', 'user'],
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        roleId: user.roleId,
      },
      permissions: userPermissions.map((up) => ({
        id: up.permission.id,
        permission: up.permission.permission,
        description: up.permission.description,
      })),
    };
  }
}
