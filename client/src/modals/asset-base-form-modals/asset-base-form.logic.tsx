'use client';

import { useState, useMemo, useEffect, useId } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { toast } from '@/components/ui/sonner';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import { AssetBaseFormData, AssetBasePayload } from './asset-form.interface';
import {
  createBaseAsset,
  updateBaseAsset,
} from '@/api/protected/assets-api/asset.api';
import { Description } from '@radix-ui/react-dialog';
import { formatDate } from '@syntaxsentinel/date-utils';
import createDialogConfig from '@/utils/create-dialog-config';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

export default function useAssetBaseFormLogic(
  open: boolean,
  close: () => void,
  mode: 'add' | 'edit' = 'add',
  initialData: AssetBaseFormData | null = null,
  onSuccess?: () => void,
) {
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );

  const getInitialFormData = (
    initialData?: AssetBaseFormData | null,
  ): AssetBaseFormData => ({
    assetNo: initialData?.assetNo ?? '',
    assetName: initialData?.assetName ?? '',
    assetDescription: initialData?.assetDescription ?? '',
    assetImage: initialData?.assetImage ?? '',
    manufacturer: initialData?.manufacturer ?? '',
    acquisitionCost: initialData?.acquisitionCost ?? 0,
    currentQuantity: initialData?.currentQuantity ?? 0,
    isDraft: initialData?.isDraft ?? true,
    acquisitionDate:
      initialData?.acquisitionDate ?? formatDate.dateTime(new Date()),
    warrantyDate: initialData?.warrantyDate ?? formatDate.dateTime(new Date()),
    // new fields for acquisition info (optional fiels)
    purchaseOrderNo: initialData?.purchaseOrderNo ?? '',
    supplier: initialData?.supplier ?? '',
    supplierContactNo: initialData?.supplierContactNo ?? '',
    supplierContactEmail: initialData?.supplierContactEmail ?? '',
    purchaseDate: initialData?.purchaseDate ?? formatDate.dateTime(new Date()),
    deliveryDate: initialData?.deliveryDate ?? formatDate.dateTime(new Date()),
    acquisitionType: initialData?.acquisitionType ?? '',
    invoiceAmount: initialData?.invoiceAmount ?? 0,
    invoiceNo: initialData?.invoiceNo ?? '',
  });

  const [formData, setFormData] = useState<AssetBaseFormData>(
    getInitialFormData(initialData),
  );
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleReset = () => {
    setFormData(getInitialFormData(initialData));
    setIsConfirmed(false);
    showToastSuccess('Form Reset', 'Form Reset Successfully', 'top-center');
  };

  const dialogConfig = {
    close: createDialogConfig(
      'Discard changes?',
      'Are you sure you want to close this form? Unsaved changes will be lost.',
      'Yes, Close',
      <IoWarningOutline className="w-8 h-8 text-yellow-500" />,
      () => close(),
    ),
    reset: createDialogConfig(
      'Reset form?',
      'Are you sure you want to reset the form? All input will be cleared.',
      'Yes, Reset',
      <IoRefreshOutline className="w-8 h-8 text-blue-500" />,
      () => handleReset(),
    ),
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

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(initialData));
    }
  }, [open, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function submitData() {
    let response;
    if (mode === 'add') {
      response = await createBaseAsset({ ...formData });
    } else if (mode === 'edit' && initialData?.id) {
      const updatedData = getChangedFields(initialData, formData, {
        skipEmpty: true,
      });
      if (Object.keys(updatedData).length > 0) {
        response = await updateBaseAsset(initialData.id, updatedData);
      }
    }
    return response;
  }
  const handleSubmit = async (e?: React.FormEvent | boolean) => {
    if (typeof e !== 'boolean') e?.preventDefault();
    setLoading(true);

    try {
      const response = await submitData();
      close();
      onSuccess?.();
      setError('');
    } catch (error: unknown) {
      showToastError(
        'Operation failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  // Compute before/after preview data for FormPreviewer
  const previewData = useMemo(() => {
    if (mode === 'edit' && initialData) {
      // Compute the updated (after) data
      const updatedData = getChangedFields<AssetBaseFormData, AssetBasePayload>(
        initialData,
        formData,
        { skipEmpty: true },
      );

      const { assetImage, ...filteredUpdatedData } = updatedData;
      return {
        before: initialData,
        after: { ...initialData, ...filteredUpdatedData },
      };
    }

    // Default (create mode)
    return {
      before: formData,
      after: formData,
    };
  }, [mode, formData, initialData]);

  // At the bottom of your hook, before the return:

  // Check if all required fields are filled (except assetImage)
  const isFormValid = useMemo(() => {
    const {
      assetNo,
      assetName,
      assetDescription,
      manufacturer,
      acquisitionCost,
      currentQuantity,
      acquisitionDate,
      warrantyDate,
    } = formData;
    return (
      assetNo.trim() !== '' &&
      assetName.trim() !== '' &&
      assetDescription.trim() !== '' &&
      manufacturer.trim() !== '' &&
      acquisitionCost > 0 &&
      currentQuantity > 0 &&
      acquisitionDate.trim() !== '' &&
      warrantyDate.trim() !== ''
    );
  }, [formData]);

  // Check if form has changes in edit mode
  const hasChanges = useMemo(() => {
    if (mode === 'add') return true;
    if (!initialData) return false;
    const updatedFields = getChangedFields(initialData, formData, {
      skipEmpty: true,
    });
    return Object.keys(updatedFields).length > 0;
  }, [formData, initialData, mode]);

  return {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleSubmit,
    handleReset,
    formData,
    setFormData,
    handleChange,
    handleNumericChange,
    previewData,
    isFormValid,
    hasChanges,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
  };
}
