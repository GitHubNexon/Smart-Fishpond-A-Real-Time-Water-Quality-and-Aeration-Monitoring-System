export interface AssetInventoryFormData {
  id?: string;
  asset: string;
  inventoryNo: string;
  qrCode: string;
  barCode: string;
  rfidTag: string;
  location: string;
}

export interface AssetInventoryPayload {
  id?: string;
  asset: string;
  inventoryNo: string;
  qrCode: string;
  barCode: string;
  rfidTag: string;
  location: string;
}
