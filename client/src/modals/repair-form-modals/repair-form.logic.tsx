'use client';

import { useState, useEffect, useMemo } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import {
  createTransaction,
  findByTransactionNumber,
} from '@/api/protected/assets-api/asset-transaction.api';
import {
  getItemInventory,
  InventoryStatus,
} from '@/api/protected/assets-api/asset-inventory-api';
import { formatDate } from '@syntaxsentinel/date-utils';
import { RepairFormData, RepairTransactionType } from './repair-form.interface';
import { EmployeeData } from '@/interfaces/employee-api.interface';

interface InventoryItemResponse {
  id: string;
  asset: { id: string; assetName?: string; assetNo?: string };
  inventoryNo: string;
  status: string;
  qrCode: string | null;
  barCode: string | null;
  rfidTag: string | null;
  location: string | null;
  custodian?: EmployeeData | null;
}

interface RepairData {
  id?: string;
  inventory: InventoryItemResponse & {
    custodian?: any;
  };
  custodian?: any;
  transactionNo?: string;
  transactionType?: string;
  transactionDate?: string;
  remarks?: string | null;
  reason?: string | null;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  repairVendor?: string;
  repairCost?: Number;
  repairDescription?: string;
  estimatedCompletionDate?: string;
}

// configuration for transaction types that need auto-population
const AUTO_POPULATE_CONFIG = {
  [RepairTransactionType.SEND_TO_REPAIR]: {
    needsTransactionNo: true,
    statusFilter: [InventoryStatus.ForRepair],
  },
  [RepairTransactionType.FAIL_REPAIR]: {
    needsTransactionNo: true,
    statusFilter: [InventoryStatus.Repaired],
  },
  [RepairTransactionType.COMPLETE_REPAIR]: {
    needsTransactionNo: true,
    statusFilter: [InventoryStatus.Repaired],
  },
};

export default function useRepairFormLogic(
  open: boolean,
  close: () => void,
  onSuccess?: () => void,
) {
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );
  const [showTransactionTypeSelector, setShowTransactionTypeSelector] =
    useState(true);
  const [showTransactionNoInput, setShowTransactionNoInput] = useState(false);
  const [transactionNoInput, setTransactionNoInput] = useState('');
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [transactionNoPopup, setTransactionNoPopup] = useState<string | null>(
    null,
  );

  const [showTransactionNoPopup, setShowTransactionNoPopup] = useState(false);
  const [availableInventory, setAvailableInventory] = useState<
    InventoryItemResponse[]
  >([]);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false);

  const [selectedCustodian, setSelectedCustodian] =
    useState<EmployeeData | null>(null);

  const [formData, setFormData] = useState<RepairFormData>({
    inventoryIds: [],
    transactionType: RepairTransactionType.REQUEST_REPAIR,
    transactionDate: formatDate.dateTime(new Date()),
    approvedAt: formatDate.dateTime(new Date()),
    repairVendor: '',
    repairCost: 0,
    repairDescription: '',
    estimatedCompletionDate: formatDate.dateTime(new Date()),
  });

  const defaultFormData: RepairFormData = {
    inventoryIds: [],
    transactionType: RepairTransactionType.REQUEST_REPAIR,
    transactionDate: formatDate.dateTime(new Date()),
    approvedAt: formatDate.dateTime(new Date()),
    repairVendor: '',
    repairCost: 0,
    repairDescription: '',
    estimatedCompletionDate: formatDate.dateTime(new Date()),
  };

  const needsAutoPopulate = useMemo(() => {
    return formData.transactionType in AUTO_POPULATE_CONFIG;
  }, [formData.transactionType]);

  const filteredInventory = useMemo(() => {
    if (!inventorySearchQuery.trim()) {
      return availableInventory;
    }

    const query = inventorySearchQuery.toLowerCase();
    return availableInventory.filter((item) => {
      const inventoryNo = item.inventoryNo.toLowerCase();
      const assetName = item.asset?.assetName?.toLowerCase() || '';
      const assetNo = item.asset?.assetNo?.toLowerCase() || '';
      const location = item.location?.toLowerCase() || '';

      return (
        inventoryNo.includes(query) ||
        assetName.includes(query) ||
        assetNo.includes(query) ||
        location.includes(query)
      );
    });
  }, [availableInventory, inventorySearchQuery]);

  // useEffect(() => {
  //   if (selectedCustodian) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       custodianId: selectedCustodian.id,
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       custodianId: '',
  //     }));
  //   }
  // }, [selectedCustodian]);

  const autoPopulateFromTransaction = async (transactionNo: string) => {
    setLoadingTransaction(true);
    try {
      const response = await findByTransactionNumber(
        transactionNo,
        formData.transactionType,
      );

      if (!response.data || response.data.length === 0) {
        showToastError(
          'Transaction Not Found',
          `No transaction found with number: ${transactionNo}`,
          'bottom-right',
        );
        return false;
      }

      const transactions: RepairData[] = response.data;
      const inventoryIds = transactions.map((t) => t.inventory.id);
      //  const custodian = transactions[0].custodian; // May be undefined
      //  if (
      //    custodian &&
      //    formData.transactionType !== RepairTransactionType.MAKE_AVAILABLE
      //  ) {
      //    setSelectedCustodian(custodian);
      //  }
      const inventoryItems = transactions.map((t) => t.inventory);

      setAvailableInventory(inventoryItems);
      setFormData((prev) => ({
        ...prev,
        inventoryIds,
        // custodianId: custodian?.id || '',
        //  custodianId:
        //    formData.transactionType === RepairTransactionType.MAKE_AVAILABLE
        //      ? ''
        //      : custodian?.id || '',
        transactionDate: transactions[0].transactionDate
          ? formatDate.dateTime(new Date(transactions[0].transactionDate))
          : prev.transactionDate,
        remarks: transactions[0].remarks || '',
        reason: transactions[0].reason || '',
        repairVendor: transactions[0].repairVendor || '',
        repairCost: Number(transactions[0].repairCost) || 0,
        repairDescription: transactions[0].repairDescription || '',
        estimatedCompletionDate:
          transactions[0].estimatedCompletionDate ||
          formatDate.dateTime(
            new Date(transactions[0].estimatedCompletionDate),
          ),
      }));

      showToastSuccess(
        'Transaction Loaded',
        `Loaded ${inventoryIds.length} item(s) from transaction ${transactionNo}`,
        'top-center',
      );

      return true;
    } catch (error: unknown) {
      showToastError(
        'Failed to Load Transaction',
        extractErrorMessage(error),
        'bottom-right',
      );
      return false;
    } finally {
      setLoadingTransaction(false);
    }
  };

  const handleTransactionNoSubmit = async () => {
    if (!transactionNoInput.trim()) {
      showToastError(
        'Invalid Input',
        'Please enter a transaction number',
        'bottom-right',
      );
      return;
    }

    const success = await autoPopulateFromTransaction(transactionNoInput);
    if (success) {
      setShowTransactionNoInput(false);
    }
  };

  const fetchAvailableInventory = async (
    transactionType: RepairTransactionType,
  ) => {
    setLoadingInventory(true);
    try {
      let statuses: InventoryStatus[] = [];
      switch (transactionType) {
        case RepairTransactionType.RETURN_FOR_REPAIR:
          statuses = [InventoryStatus.Issued];
          break;
        case RepairTransactionType.SEND_TO_REPAIR:
          statuses = [InventoryStatus.ForRepair];
          break;
        case RepairTransactionType.COMPLETE_REPAIR:
          statuses = [InventoryStatus.Repaired];
          break;
        case RepairTransactionType.FAIL_REPAIR:
          statuses = [InventoryStatus.Repaired];
          break;

        default:
          statuses = [InventoryStatus.Available];
      }
      const response = await getItemInventory(statuses);
      setAvailableInventory(response.data || []);

      if (response.data?.length === 0) {
        showToastError(
          'No Items Available',
          `No inventory items found with the required status for this transaction type`,
          'bottom-right',
        );
      }
    } catch (error: unknown) {
      showToastError(
        'Failed to Load Inventory',
        extractErrorMessage(error),
        'bottom-right',
      );
      setAvailableInventory([]);
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleTransactionTypeSelect = (type: RepairTransactionType) => {
    setFormData({
      ...defaultFormData,
      transactionType: type,
    });
    setShowTransactionTypeSelector(false);
    const config = AUTO_POPULATE_CONFIG[type];
    if (config?.needsTransactionNo) {
      setShowTransactionNoInput(true);
    } else {
      fetchAvailableInventory(type);
    }
  };

  const handleInventoryToggle = (inventoryId: string) => {
    setFormData((prev) => {
      const isSelected = prev.inventoryIds.includes(inventoryId);
      return {
        ...prev,
        inventoryIds: isSelected
          ? prev.inventoryIds.filter((id) => id !== inventoryId)
          : [...prev.inventoryIds, inventoryId],
      };
    });
  };

  const handleSelectAllInventory = () => {
    const allIds = availableInventory.map((item) => item.id);
    setFormData((prev) => ({
      ...prev,
      inventoryIds: allIds,
    }));
  };

  const handleDeselectAllInventory = () => {
    setFormData((prev) => ({
      ...prev,
      inventoryIds: [],
    }));
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setAvailableInventory([]);
    setShowTransactionTypeSelector(true);
    setShowTransactionNoInput(false);
    setTransactionNoInput('');
    setSelectedCustodian(null);
    setIsConfirmed(false);
  };

  const dialogConfig = {
    close: {
      title: 'Discard changes?',
      description:
        'Are you sure you want to close this form? Unsaved changes will be lost.',
      proceed: 'Yes, Close',
      cancel: 'Cancel',
      icon: <IoWarningOutline className="w-8 h-8 text-yellow-500" />,
      action: () => {
        close();
        handleReset();
      },
    },
    reset: {
      title: 'Reset form?',
      description:
        'Are you sure you want to reset the form? All input will be cleared.',
      proceed: 'Yes, Reset',
      cancel: 'Cancel',
      icon: <IoRefreshOutline className="w-8 h-8 text-blue-500" />,
      action: () => handleReset(),
    },
  };

  const currentDialog = confirmType ? dialogConfig[confirmType] : null;
  const openConfirm = (type: 'close' | 'reset') => setConfirmType(type);
  const handleCancel = () => setConfirmType(null);
  const handleConfirm = () => {
    if (confirmType) {
      dialogConfig[confirmType].action();
    }
    setConfirmType(null);
  };

  const handleSubmitTransaction = async (e?: React.FormEvent | boolean) => {
    if (typeof e !== 'boolean') e?.preventDefault();
    if (formData.inventoryIds.length === 0) {
      showToastError(
        'No Items Selected',
        'Please select at least one inventory item',
        'bottom-right',
      );
      return;
    }

    // if (
    //   formData.transactionType !== RepairTransactionType.MAKE_AVAILABLE &&
    //   !formData.custodianId
    // ) {
    //   showToastError(
    //     'No Custodian',
    //     'Please select a custodian',
    //     'bottom-right',
    //   );
    //   return;
    // }

    setLoading(true);
    try {
      const payload: any = {
        inventoryIds: formData.inventoryIds,
        transactionType: formData.transactionType,
        // custodianId: formData.custodianId,
        transactionDate: formData.transactionDate,
      };

      if (formData.remarks) payload.remarks = formData.remarks;
      if (formData.reason) payload.reason = formData.reason;

      // Add transfer location and department fields
      if (formData.repairVendor) payload.repairVendor = formData.repairVendor;
      if (formData.repairCost) payload.repairCost = formData.repairCost;
      if (formData.repairDescription)
        payload.repairDescription = formData.repairDescription;
      if (formData.estimatedCompletionDate)
        payload.estimatedCompletionDate = formData.estimatedCompletionDate;

      const response = await createTransaction(payload);

      showToastSuccess(
        'Transaction Created',
        response.message || 'Transaction completed successfully',
        'top-right',
      );

      const transactionNo = response.data?.[0]?.transactionNo;
      if (transactionNo) {
        setTransactionNoPopup(transactionNo);
        setShowTransactionNoPopup(true);
      }

      handleReset();
      close();
      onSuccess?.();
    } catch (error: unknown) {
      showToastError(
        'Transaction Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    setShowPreview(false);
    setIsConfirmed(true);
    handleCancel();
  };

  const handleActionClick = () => {
    if (isConfirmed) {
      handleSubmitTransaction(true);
      setIsConfirmed(false);
    } else {
      handlePreview();
    }
  };

  const selectedInventoryItems = useMemo(() => {
    return availableInventory.filter((item) =>
      formData.inventoryIds.includes(item.id),
    );
  }, [availableInventory, formData.inventoryIds]);

  const isFormValid = useMemo(() => {
    return (
      formData.inventoryIds.length > 0 &&
      // formData.custodianId !== '' &&
      formData.transactionDate !== ''
    );
  }, [formData]);

  useEffect(() => {
    if (isConfirmed) {
      setIsConfirmed(false);
    }
  }, [formData]);

  return {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleReset,
    formData,
    setFormData,
    availableInventory,
    employees,
    loading,
    loadingInventory,
    loadingTransaction,
    showTransactionTypeSelector,
    showTransactionNoInput,
    transactionNoInput,
    setTransactionNoInput,
    handleTransactionNoSubmit,
    handleTransactionTypeSelect,
    handleInventoryToggle,
    handleSelectAllInventory,
    handleDeselectAllInventory,
    selectedInventoryItems,
    handleSubmitTransaction,
    isFormValid,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
    handlePreview,
    handleConfirmSubmit,
    handleActionClick,
    setSelectedCustodian,
    selectedCustodian,
    needsAutoPopulate,
    transactionNoPopup,
    setTransactionNoPopup,
    showTransactionNoPopup,
    setShowTransactionNoPopup,
    inventorySearchQuery,
    setInventorySearchQuery,
    filteredInventory,
  };
}
