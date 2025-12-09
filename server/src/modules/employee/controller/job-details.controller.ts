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
import { JobDetailsService } from '../services/job-details.service';
import { CreateEmployeeJobDetailsDto } from '../dto/create-employee-job-details.dto';
import { UpdateEmployeeJobDetailsDto } from '../dto/update-employee-job-details.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/modules/users/entities/user.entity';

@UseGuards(SessionGuard)
@UseGuards(JwtAuthGuard)
@Controller('employee-job-details')
export class JobDetailsController {
  constructor(private readonly jobDetailsService: JobDetailsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createEmployeeJobDetails(
    @Body() createEmployeeDetails: CreateEmployeeJobDetailsDto,
    @GetUser() currentUser: User,
  ) {
    const result = await this.jobDetailsService.createEmployeeJobDetails(
      createEmployeeDetails,
      currentUser,
    );

    return {
      status: 'success',
      message: 'Job Details Created Successfully',
      data: result,
    };
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updatedEmployeeJobDetails(
    @Param('id') id: string,
    @Body() updateEmployeeJobDetails: UpdateEmployeeJobDetailsDto,
    @GetUser() currentUser: User,
  ) {
    const { old_data, new_data } =
      await this.jobDetailsService.updatedEmployeeJobDetails(
        id,
        updateEmployeeJobDetails,
        currentUser,
      );
    return {
      status: 'success',
      message: 'Job Details updated successfully',
      old_data,
      new_data,
    };
  }

  @Get('get-all-paginated')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedJobDetails(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.jobDetailsService.getAllPaginatedJobDetails(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Employees Job Details fetched successfully',
      ...result,
    };
  }
}
