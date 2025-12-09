export enum RepairTransactionType {
  REQUEST_REPAIR = 'request_repair', // Available → ForRepair (not issued)
  RETURN_FOR_REPAIR = 'return_for_repair', // Issued → ForRepair (the one who's been issued and for repair)
  SEND_TO_REPAIR = 'send_to_repair', // ForRepair → Repaired (in progress)
  COMPLETE_REPAIR = 'complete_repair', // Repaired → Available
  FAIL_REPAIR = 'fail_repair', // Repaired → RepairFailed
}

export interface RepairFormData {
  inventoryIds: string[];
  transactionType: RepairTransactionType;
  transactionDate: string;
  remarks?: string;
  reason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  repairVendor?: string;
  repairCost?: number;
  repairDescription?: string;
  estimatedCompletionDate?: string;
}
