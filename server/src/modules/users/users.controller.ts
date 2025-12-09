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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/modules/users/entities/user.entity';

@UseGuards(SessionGuard)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() currentUser: User,
  ) {
    const result = await this.usersService.createUser(
      createUserDto,
      currentUser,
    );

    return {
      status: 'success',
      message: 'User Created Successfully',
      data: result,
    };
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User,
  ) {
    const { old_data, new_data } = await this.usersService.updateUser(
      id,
      updateUserDto,
      currentUser,
    );
    return {
      status: 'success',
      message: 'User updated successfully',
      old_data,
      new_data,
    };
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    const deletedUser = await this.usersService.deleteUser(id, deleteUserDto);

    return {
      status: 'success',
      message: `User with email ${deleteUserDto.email} has been deleted successfully`,
    };
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.usersService.getAllPaginatedUsers(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Users fetched successfully',
      ...result,
    };
  }

  /** Soft delete user */
  @Post('soft-delete/:id')
  @HttpCode(HttpStatus.OK)
  async softDeleteUser(@Param('id') id: string, @GetUser() currentUser: User) {
    const deletedUser = await this.usersService.softDeleteUser(id, currentUser);
    return {
      status: 'success',
      message: `User ${deletedUser.email} has been Deactivated successfully`,
    };
  }

  /** Recover soft-deleted user */
  @Post('recover/:id')
  @HttpCode(HttpStatus.OK)
  async recoverDeletedUser(
    @Param('id') id: string,
    @GetUser() currentUser: User,
  ) {
    const recoveredUser = await this.usersService.recoverDeletedUser(
      id,
      currentUser,
    );
    return {
      status: 'success',
      message: `User ${recoveredUser.email} has been recovered successfully`,
      data: recoveredUser,
    };
  }

  /** GET user by id */
  @Get('get-user/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);

    return {
      status: 'success',
      message: 'User fetched successfully',
      data: user,
    };
  }

  @Get('get-all-users-list')
  @HttpCode(HttpStatus.OK)
  async findAllUsers() {
    return this.usersService.getAllUsersList();
  }
}
