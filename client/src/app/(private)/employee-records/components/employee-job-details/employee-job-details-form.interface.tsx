import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
  TerminationReasonEnum,
} from '@/api/protected/job-details-api/job-details.enum';
import { EmployeeData } from '@/api/protected/employee-api/employee.interface';

export interface EmployeeJobDetailsPayload {
  id?: string | null;
  position?: string | null;
  department?: string | null;
  employmentType?: EmploymentTypeEnum;
  employmentStatus?: EmploymentStatusEnum;
  dateHired?: string | null;
  dateRegularized?: string | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  probationPeriodEnd?: string | null;
  resignedDate?: string | null;
  resignationReason?: string | null;
  resignationNotes?: string | null;
  terminatedDate?: string | null;
  terminationReason?: TerminationReasonEnum;
  terminationNotes?: string | null;
  retiredDate?: string | null;
  retirementNotes?: string | null;
  employee: string;
}

export interface EmployeeJobDetailsFormData {
  id?: string | null;
  position?: string | null;
  department?: string | null;
  employmentType?: EmploymentTypeEnum;
  employmentStatus?: EmploymentStatusEnum;
  dateHired?: string | null;
  dateRegularized?: string | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  probationPeriodEnd?: string | null;
  resignedDate?: string | null;
  resignationReason?: string | null;
  resignationNotes?: string | null;
  terminatedDate?: string | null;
  terminationReason?: TerminationReasonEnum;
  terminationNotes?: string | null;
  retiredDate?: string | null;
  retirementNotes?: string | null;
  employee: string;
}
