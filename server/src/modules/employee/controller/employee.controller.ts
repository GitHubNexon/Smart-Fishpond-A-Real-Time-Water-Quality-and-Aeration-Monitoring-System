import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/modules/users/entities/user.entity';

@UseGuards(SessionGuard)
@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createEmployee(
    @Body() createEmployee: CreateEmployeeDto,
    @GetUser() currentUser: User,
  ) {
    const result = await this.employeeService.createEmployee(
      createEmployee,
      currentUser,
    );

    return {
      status: 'success',
      message: 'Employee Created Successfully',
      data: result,
    };
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateEmployee: UpdateEmployeeDto,
    @GetUser() currentUser: User,
  ) {
    const { old_data, new_data } = await this.employeeService.updateEmployee(
      id,
      updateEmployee,
      currentUser,
    );
    return {
      status: 'success',
      message: 'Employee updated successfully',
      old_data,
      new_data,
    };
  }

  @Get('get-all-paginated')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedEmployees(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.employeeService.getAllPaginatedEmployees(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Employees fetched successfully',
      ...result,
    };
  }

  @Get('get-employee/:idOrEmployeeId')
  @HttpCode(HttpStatus.OK)
  async getEmployee(@Param('idOrEmployeeId') idOrEmployeeId: string) {
    const employee = await this.employeeService.getEmployeeById(idOrEmployeeId);

    return {
      status: 'success',
      message: 'Employee fetched successfully',
      data: employee,
    };
  }

  @Post('verify/:id')
  @HttpCode(HttpStatus.OK)
  async verifyEmployee(@Param('id') id: string, @GetUser() currentUser: User) {
    const verifiedEmployee = await this.employeeService.verifyEmployee(
      id,
      currentUser,
    );
    return {
      status: 'success',
      message: `Employee ${verifiedEmployee.employeeId} has been verified successfully`,
      data: verifiedEmployee,
    };
  }
}
