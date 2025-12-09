import { UserData } from '@/interfaces/user-api.interface';
import { EmployeeData } from '../employee-api/employee.interface';
import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
  TerminationReasonEnum,
} from './job-details.enum';

export interface GetAllPaginatedJobDetails {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  job_details_data: JobDetailsData[];
}

export interface JobDetailsData {
  employee: EmployeeData;
  id?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  version?: number | null;
  isVerified: boolean;
  verifiedAt: string | null;
  preparedBy?: UserData | null;

  position?: string | null;
  department?: string | null;
  employmentType?: EmploymentTypeEnum;
  employmentStatus?: EmploymentStatusEnum;
  dateHired?: string | null;
  dateRegularized?: string | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  resignedDate?: string | null;
  terminatedDate?: string | null;
  retiredDate?: string | null;
  probationPeriodEnd?: string | null;
  resignationReason?: string | null;
  resignationNotes?: string | null;
  terminationReason?: TerminationReasonEnum;
  terminationNotes?: string | null;
  retirementNotes?: string | null;
}

export interface JobDetailsRequest {
  employee: EmployeeData;
  id?: string | null;
  position?: string | null;
  department?: string | null;
  employmentType?: EmploymentTypeEnum;
  employmentStatus?: EmploymentStatusEnum;
  dateHired?: string | null;
  dateRegularized?: string | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  resignedDate?: string | null;
  terminatedDate?: string | null;
  retiredDate?: string | null;
  probationPeriodEnd?: string | null;
  resignationReason?: string | null;
  resignationNotes?: string | null;
  terminationReason?: TerminationReasonEnum;
  terminationNotes?: string | null;
  retirementNotes?: string | null;
}

export interface JobDetailsResponse {
  status: string;
  message: string;
  data: JobDetailsData | null;
}
