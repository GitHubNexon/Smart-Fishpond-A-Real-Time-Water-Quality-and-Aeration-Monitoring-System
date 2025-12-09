import { UserData } from './user-api.interface';
import { AssetInventoryInfo } from '@/interfaces/assets.interface';

export interface GetAllPaginatedEmployee {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  employee_data: EmployeeData[];
}

export interface EmployeeRequest {
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  contactNumber: string;
  position: string;
  department: string;
}

export interface EmployeeData {
  id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  contactNumber: string;
  position: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  isVerified: boolean;
  user: UserData;
  issuedAsset?: AssetInventoryInfo | null;
}

export interface EmployeeResponse {
  status: string;
  message: string;
  data: EmployeeData | null;
}
