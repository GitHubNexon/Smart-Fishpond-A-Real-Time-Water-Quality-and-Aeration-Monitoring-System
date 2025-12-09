// asset-inventory-form.logic.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import {
  generateTempInventory,
  saveDraftInventory,
} from '@/api/protected/assets-api/asset-inventory-api';

// Inventory item from API response
interface InventoryItemResponse {
  id: string;
  asset: { id: string };
  inventoryNo: string;
  status: string;
  qrCode: string | null;
  barCode: string | null;
  rfidTag: string | null;
  location: string | null;
}

interface FormData {
  qrCode: string;
  barCode: string;
  rfidTag: string;
  location: string;
}

export default function useAssetInventoryFormLogic(
  open: boolean,
  close: () => void,
  onSuccess?: () => void,
) {
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItemResponse[]>(
    [],
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingItem, setRemainingItem] = useState<any | null>(null);
  const [totalGenerated, setTotalGenerated] = useState<any | null>(null);

  const [formData, setFormData] = useState<FormData>({
    qrCode: '',
    barCode: '',
    rfidTag: '',
    location: '',
  });

  const defaultFormData: FormData = {
    qrCode: '',
    barCode: '',
    rfidTag: '',
    location: '',
  };

  // Generate temporary inventory items when asset is selected
  const handleGenerateTempInventory = async (assetId: string) => {
    setLoading(true);
    try {
      const response = await generateTempInventory(assetId);
      setInventoryItems(response.data || []);
      setRemainingItem(response.meta?.remaining || 0);
      setTotalGenerated(response.meta?.total || 0);
      showToastSuccess(
        'Inventory Generated',
        `${response.data?.length || 0} inventory items created`,
        'top-right',
      );
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToastError(
        'Generation Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle asset selection
  const handleAssetSelect = (asset: any | null) => {
    setSelectedAsset(asset);
    setInventoryItems([]);
    setEditingIndex(null);
    setFormData(defaultFormData);

    if (asset?.id) {
      handleGenerateTempInventory(asset.id);
    }
  };

  const handleReset = () => {
    setSelectedAsset(null);
    setInventoryItems([]);
    setFormData(defaultFormData);
    setEditingIndex(null);
    showToastSuccess('Form Reset', 'Form Reset Successfully', 'top-center');
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
        setSelectedAsset(null);
        setInventoryItems([]);
        setEditingIndex(null);
        setFormData(defaultFormData);
        close();
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

  // Handle edit from table - populates form
  const handleEditInventoryItem = (
    index: number,
    row: InventoryItemResponse,
  ) => {
    setEditingIndex(index);
    setFormData({
      qrCode: row.qrCode || '',
      barCode: row.barCode || '',
      rfidTag: row.rfidTag || '',
      location: row.location || '',
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete from table
  const handleDeleteInventoryItems = (indices: number[]) => {
    setInventoryItems((prev) => prev.filter((_, i) => !indices.includes(i)));
    showToastSuccess(
      'Items Removed',
      `${indices.length} item(s) removed from list`,
      'top-center',
    );
  };

  // Handle save changes for edited item (update in local state only)
  const handleSaveEditedItem = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (editingIndex !== null) {
      // Update local state only
      setInventoryItems((prev) =>
        prev.map((item, i) =>
          i === editingIndex
            ? {
                ...item,
                qrCode: formData.qrCode || null,
                barCode: formData.barCode || null,
                rfidTag: formData.rfidTag || null,
                location: formData.location || null,
              }
            : item,
        ),
      );
      showToastSuccess('Item Updated', 'Changes saved".', 'top-center');
      setEditingIndex(null);
      setFormData(defaultFormData);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData(defaultFormData);
  };

  // Save all inventory items as draft
  const handleSaveDraft = async () => {
    if (inventoryItems.length === 0) {
      showToastError('No Items', 'No inventory items to save', 'bottom-right');
      return;
    }

    setLoading(true);
    try {
      // Prepare payload for all items
      const payload = inventoryItems.map((item) => ({
        id: item.id,
        inventoryNo: item.inventoryNo,
        asset: item.asset.id,
        status: item.status,
        qrCode: item.qrCode,
        barCode: item.barCode,
        rfidTag: item.rfidTag,
        location: item.location,
      }));

      const response = await saveDraftInventory(payload);
      showToastSuccess('Draft Saved', response.message, 'top-right');
      handleReset();
      close();
      onSuccess?.();
    } catch (error: unknown) {
      showToastError('', extractErrorMessage(error), 'bottom-right');
    } finally {
      setLoading(false);
    }
  };

  // Compute preview data
  const previewData = useMemo(() => {
    return {
      before: inventoryItems,
      after: inventoryItems,
    };
  }, [inventoryItems]);

  // Check if form is valid (has asset selected and inventory items)
  const isFormValid = useMemo(() => {
    return selectedAsset !== null && inventoryItems.length > 0;
  }, [selectedAsset, inventoryItems]);

  return {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleReset,
    formData,
    setFormData,
    selectedAsset,
    handleAssetSelect,
    inventoryItems,
    editingIndex,
    handleEditInventoryItem,
    handleDeleteInventoryItems,
    handleSaveEditedItem,
    handleCancelEdit,
    handleSaveDraft,
    loading,
    previewData,
    isFormValid,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
    remainingItem,
    totalGenerated,
  };
}
