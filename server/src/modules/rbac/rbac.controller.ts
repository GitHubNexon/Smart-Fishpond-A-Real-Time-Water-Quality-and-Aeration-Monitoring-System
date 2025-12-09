import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { RbacService } from './rbac.service';
import {
  CreateAccessDto,
  CreatePermissionDto,
  CreateRoleDto,
} from './dto/create-rbac.dto';
import { UpdateRoleDto, UpdatePermissionDto } from './dto/update-rbac.dto';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';

@UseGuards(SessionGuard)
@UseGuards(JwtAuthGuard)
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('create-role')
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.rbacService.createRole(createRoleDto);

    return {
      status: 'success',
      message: 'Role Created Successfully',
      data: result,
    };
  }

  @Patch('update-role/:id')
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const { old_data, new_data } = await this.rbacService.updateRole(
      id,
      updateRoleDto,
    );
    return {
      status: 'success',
      message: 'Role updated successfully',
      old_data,
      new_data,
    };
  }

  @Post('soft-delete-role/:id')
  @HttpCode(HttpStatus.OK)
  async softDeleteRole(@Param('id') id: string) {
    const deletedRole = await this.rbacService.softDeleteRole(id);
    return {
      status: 'success',
      message: `Role ${deletedRole.role} has been soft-deleted successfully`,
    };
  }

  @Post('recover-role/:id')
  @HttpCode(HttpStatus.OK)
  async recoverDeleteRole(@Param('id') id: string) {
    const recoverRole = await this.rbacService.recoverDeleteRole(id);
    return {
      status: 'success',
      message: `Role ${recoverRole.role} has been recovered successfully`,
      data: recoverRole,
    };
  }

  @Post('soft-delete-permission/:id')
  @HttpCode(HttpStatus.OK)
  async softDeletePermission(@Param('id') id: string) {
    const deletePermission = await this.rbacService.softDeletePermission(id);
    return {
      status: 'success',
      message: `Permission ${deletePermission.permission} has been soft-deleted successfully`,
    };
  }

  @Post('recover-permission/:id')
  @HttpCode(HttpStatus.OK)
  async recoverDeletePermission(@Param('id') id: string) {
    const recoverPermission =
      await this.rbacService.recoverDeletePermission(id);
    return {
      status: 'success',
      message: `Permission ${recoverPermission.permission} has been recovered successfully`,
      data: recoverPermission,
    };
  }

  @Post('create-permission')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.rbacService.createPermission(createPermissionDto);

    return {
      status: 'success',
      message: 'Permission Created Successfully',
      data: result,
    };
  }

  @Patch('update-permission/:id')
  @HttpCode(HttpStatus.OK)
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const { old_data, new_data } = await this.rbacService.updatePermission(
      id,
      updatePermissionDto,
    );
    return {
      status: 'success',
      message: 'Permission updated successfully',
      old_data,
      new_data,
    };
  }

  @Post('assign-permissions')
  @HttpCode(HttpStatus.CREATED)
  async assignPermissions(@Body() dto: CreateUserPermissionDto) {
    const result = await this.rbacService.createUserPermission(dto);

    return {
      status: 'success',
      message: 'Permissions assigned to user successfully',
      data: result,
    };
  }

  @Post('remove-permissions/:userId')
  @HttpCode(HttpStatus.OK)
  async removePermissions(
    @Param('userId') userId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    const result = await this.rbacService.removeUserPermission(
      userId,
      permissionIds,
    );

    return {
      status: 'success',
      message: 'Permissions removed successfully',
      data: result,
    };
  }

  @Get('get-all-user-permissions')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedUserPermissions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.rbacService.getAllPaginatedUserPermissions(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'User permissions fetched successfully',
      ...result,
    };
  }


  @Get('get-all-roles')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedRoles(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.rbacService.getAllPaginatedRoles(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Roles fetched successfully',
      ...result,
    };
  }

  @Get('get-all-permissions')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedPermissions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.rbacService.getAllPaginatedPermissions(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Permissions fetched successfully',
      ...result,
    };
  }


  @Get('get-all-roles-list')
  @HttpCode(HttpStatus.OK)
  async findAllRoles() {
    return this.rbacService.getAllRolesList();
  }

  @Get('get-all-permission-list')
  @HttpCode(HttpStatus.OK)
  async findAllPermissions() {
    return this.rbacService.getAllPermissionList();
  }

  @Get('user-permissions/:userId')
  @HttpCode(HttpStatus.OK)
  async getUserPermissionsByUserId(@Param('userId') userId: string) {
    const result = await this.rbacService.getUserPermissionByUserId(userId);

    return {
      status: 'success',
      message: 'User permissions fetched successfully',
      data: result,
    };
  }
}
