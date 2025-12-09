import { AssetInventoryInfo } from './assets.interface';
import { Employee } from '@/modals/user-form-modals/user-form.interface';
import { UserData } from './user-api.interface';

export interface AssetTransactionInfo {
  id?: string;
  inventory: AssetInventoryInfo;
  custodian?: Employee | null;
  transactionNo?: string;
  parNo?: string;
  transactionType: string;
  fromStatus: string;
  toStatus: string;
  repairNo?: string | null;
  repairEmployee?: Employee | null;
  repairVendor?: string | null;
  repairCost?: Number | null;
  repairDescription?: string | string;
  estimatedCompletionDate?: string;
  disposalNo?: string | null;
  disposalMethod?: string | null;
  disposalValue?: Number | null;
  disposalVendor?: string | null;
  disposalCertificate?: string | null;
  transferNo?: string | null;
  transferFromLocation?: string | null;
  transferToLocation?: string | null;
  transferFromDepartment?: string | null;
  transferToDepartment?: string | null;
  incidentDate?: string;
  incidentDescription?: string | null;
  policeReportNumber?: string | null;
  insuranceClaimNumber?: string | null;
  preparedBy?: UserData | null;
  approvedBy?: UserData | null;
  rejectedBy?: UserData | null;
  approvalStatus?: string | null;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string | null;
  remarks?: string | null;
  reason?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  version?: string | null;
  deletedAt?: string | null;
  transactionDate?: string | null;
}

export interface AssetTransactionResponse {
  status: string;
  message: string;
  data: AssetTransactionInfo[];
  transactionNumber?: string;
}

export interface GetAllPaginatedAssetTransaction {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  asset_transaction_data: AssetTransactionInfo[];
}
