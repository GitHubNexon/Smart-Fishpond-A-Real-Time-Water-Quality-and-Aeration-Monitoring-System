import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCompanyProfileDto, SupplierDto } from './dto/create-system.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not } from 'typeorm';
import { UpdateSystemDto } from './dto/update-system.dto';
import { PatchService } from 'src/utils/services/patch.service';
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';
import { AuditService } from 'src/modules/audit/audit.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationsSocketService } from 'src/modules/sockets/notifications/notifications.socket.service';
import { Supplier, CompanyProfile } from './entities/system.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(CompanyProfile)
    private readonly companyProfileRepository: Repository<CompanyProfile>,
    private readonly auditService: AuditService,
    private readonly notificationService: NotificationsService,
    private readonly notifSocketService: NotificationsSocketService,
  ) {}

  async createCompanyProfile(
    createCompanyProfile: CreateCompanyProfileDto,
    currentUser: User,
  ): Promise<CompanyProfile> {
    const {
      companyName,
      registrationNumber,
      taxNumber,
      email,
      phone,
      address,
      logoUrl,
      website,
    } = createCompanyProfile;

    const newCompanyProfile = this.companyProfileRepository.create({
      companyName,
      registrationNumber,
      taxNumber,
      email,
      phone,
      address,
      logoUrl,
      website,
    });

    const saved = await this.companyProfileRepository.save(newCompanyProfile);

    return saved;
  }

  // async updateCompanyProfile(): Promise<{
  //   old_data: Partial<CompanyProfile>;
  //   new_data: CompanyProfile;
  // }> {

  // }
}
