import { UserData } from './user-api.interface';
import { AssetsInfo } from './assets.interface';

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  ACCELERATED = 'ACCELERATED',
}

export enum DepreciationFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export enum UsefulLifeUnit {
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

export interface DepreciationInfo {
  id: string;
  preparedBy: UserData;
  asset: AssetsInfo;
  //   records?: DepreciationRecord[];
  records: any[];
  usefulLife: number;
  usefulLifeUnit: UsefulLifeUnit;
  salvageValue: number;
  firstDepreciationDate?: string;
  lastDepreciationDate?: string;
  frequency: DepreciationFrequency;
  depreciationMethod: DepreciationMethod;
  isVerified: boolean;
  verifiedBy?: UserData;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt?: string;
}

export interface GetAllPaginatedAssetsDepreciation {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  asset_depreciation_data: DepreciationInfo[];
}

export interface DepreciationResponse {
  status: string;
  message: string;
  data: DepreciationInfo | null;
}

export interface DepreciationRequest {
  asset: string;
  usefulLife: number;
  usefulLifeUnit: UsefulLifeUnit;
  salvageValue: number;
  firstDepreciationDate: string;
  frequency: DepreciationFrequency;
  depreciationMethod: DepreciationMethod;
}

// export interface DepreciationRecordInfo {
//   id: 
// }