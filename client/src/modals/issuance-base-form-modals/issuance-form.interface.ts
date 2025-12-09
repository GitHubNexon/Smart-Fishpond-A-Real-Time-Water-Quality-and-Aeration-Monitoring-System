export enum IssuanceTransactionType {
  DIRECT_ISSUANCE = 'direct_issuance', // Available/NewAvailable → Issued (auto-approved)
  REQUEST_ISSUANCE = 'request_issuance', // Available → ForIssuance // checked(both New-Available and Available)
  APPROVE_ISSUANCE = 'approve_issuance', // ForIssuance → Issued
  REJECT_ISSUANCE = 'reject_issuance', // ForIssuance → New-Available
  RETURN_TO_INVENTORY = 'return_to_inventory', // Issued → ReturnedToCustodian → Available
  MAKE_AVAILABLE = 'make_available',
}

export interface IssuanceFormData {
  inventoryIds: string[];
  transactionType: IssuanceTransactionType;
  custodianId: string;
  transactionDate: string;
  remarks?: string;
  reason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface IssuanceFormPayload {
  inventoryIds: string[];
  transactionType: string;
  custodianId: string;
  transactionDate: string;
  remarks?: string;
  reason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}
