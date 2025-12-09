import { UserData } from './user-api.interface';
import { AssetTransactionInfo } from './asset-transaction.api.interface';
import { InventoryStatus } from '@/api/protected/assets-api/asset-inventory-api';
import { EmployeeData } from './employee-api.interface';

export interface AssetInventoryInfo {
  id: string;
  asset: AssetsInfo;
  inventoryNo: string;
  qrCode: string | null;
  barCode: string | null;
  rfidTag: string | null;
  location: string | null;
  isDraft: boolean;
  status: InventoryStatus;
  createdAt: string;
  transactions: AssetTransactionInfo[] | null;
  custodian: EmployeeData | null;
}

export interface AssetsInfo {
  id: string;
  assetNo: string;
  assetName: string;
  assetDescription: string;
  assetImage: string;
  manufacturer: string;
  acquisitionCost: number;
  currentQuantity: number;
  isVerified: boolean;
  isApproved: boolean;
  isDraft: boolean;
  acquisitionDate: string;
  warrantyDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  verifiedAt?: string;
  approvedAt?: string;
  inventories: AssetInventoryInfo[];
  preparedBy: UserData | null;
  finalizedBy?: UserData | null;
  verifiedBy?: UserData | null;
  approvedBy?: UserData | null;
  depreciation?: any | null;
  purchaseOrderNo?: string | null;
  supplier?: string | null;
  supplierContactNo?: string | null;
  supplierContactEmail?: string | null;
  purchaseDate?: string | null;
  deliveryDate?: string | null;
  acquisitionType?: string | null;
  invoiceAmount?: number | 0;
  invoiceNo?: string | null;
}

export interface GetAllPaginatedAssets {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  asset_data: AssetsInfo[];
}

export interface GetAllPaginatedAssetInventory {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  asset_inventory_data: AssetInventoryInfo[];
}

export interface AssetBaseRequest {
  id?: string;
  assetNo: string;
  assetName: string;
  assetDescription: string;
  assetImage: string;
  manufacturer: string;
  acquisitionCost: number;
  currentQuantity: number;
  isDraft: boolean;
  acquisitionDate: string;
  warrantyDate: string;
}

export interface AssetBaseResponse {
  status: string;
  message: string;
  data: AssetsInfo | null;
}

export interface AssetInventoryGeneration {
  status: string;
  message: string;
  meta: {
    remaining: number;
    total: number;
  };
  data: any;
}
