export interface AssetBaseFormData {
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

export interface AssetBasePayload {
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
