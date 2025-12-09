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
  BadRequestException,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';

@UseGuards(SessionGuard)
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('get-all-paginated')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.auditService.getAllPaginatedAuditLogs(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );

    return {
      status: 'success',
      message: 'Audit logs fetched successfully',
      ...result,
    };
  }

  /**
   * Fetch audit logs by transactionId
   * Example: GET /audit/transaction/TX_EMPLOYEE-CREATION-12345
   */
  @Get('get-transaction/:transactionId')
  @HttpCode(HttpStatus.OK)
  async getAuditLogsByTransaction(
    @Param('transactionId') transactionId: string,
  ) {
    if (!transactionId) {
      throw new BadRequestException('Transaction ID is required');
    }

    const logs =
      await this.auditService.getAuditLogsByTransaction(transactionId);
    return {
      status: 'success',
      message: `Audit logs for transaction ${transactionId} fetched successfully`,
      data: logs,
    };
  }
}
