export enum TransferTransactionType {
  REQUEST_TRANSFER = 'request_transfer', // Any → ForTransfer
  APPROVE_TRANSFER = 'approve_transfer', // ForTransfer → Transferred
  REJECT_TRANSFER = 'reject_transfer', // ForTransfer → (back to previous status)
  MAKE_AVAILABLE = 'make_available',
}

export interface TransferFormData {
  inventoryIds: string[];
  transactionType: TransferTransactionType;
  transactionDate: string;
  remarks?: string;
  reason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  transferFromLocation?: string;
  transferToLocation?: string;
  transferFromDepartment?: string;
  transferToDepartment?: string;
  custodianId?: string; // only if the status is from Issued
}

export interface TransferFormPayload {
  inventoryIds: string[];
  transactionType: TransferTransactionType;
  transactionDate: string;
  remarks?: string;
  reason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  transferFromLocation?: string;
  transferToLocation?: string;
  transferFromDepartment?: string;
  transferToDepartment?: string;
  custodianId?: string; // only if the status is from Issued
}
