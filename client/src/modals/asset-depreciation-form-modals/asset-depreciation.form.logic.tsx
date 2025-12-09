'use client';

import { useState, useMemo, useEffect, useId } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { toast } from '@/components/ui/sonner';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import { Description } from '@radix-ui/react-dialog';
import { formatDate } from '@syntaxsentinel/date-utils';
import createDialogConfig from '@/utils/create-dialog-config';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import {
  createDepreciationRecord,
  updateAssetDepreciationRecord,
} from '@/api/protected/assets-api/asset-depreciation.api';
import {
  DepreciationFormData,
  DepreciationPayload,
} from './asset-depreciation.form.interface';
import {
  UsefulLifeUnit,
  DepreciationFrequency,
  DepreciationMethod,
} from '@/interfaces/assets-depreciation.api.interface';
import { AssetsInfo } from '@/interfaces/assets.interface';
import {
  GetAllPaginatedAssetsDepreciation,
  DepreciationResponse,
  DepreciationRequest,
} from '@/interfaces/assets-depreciation.api.interface';

export default function useAssetDepreciationFormLogic(
  open: boolean,
  close: () => void,
  mode: 'add' | 'edit' = 'add',
  initialData: DepreciationFormData | null = null,
  onSuccess?: () => void,
) {
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );

  const getInitialFormData = (
    initialData?: DepreciationFormData | null,
  ): DepreciationFormData => ({
    asset: initialData?.asset ?? null,
    usefulLife: initialData?.usefulLife ?? 0,
    usefulLifeUnit: initialData?.usefulLifeUnit ?? UsefulLifeUnit.YEARS,
    salvageValue: initialData?.salvageValue ?? 0, // must add this too
    firstDepreciationDate:
      initialData?.firstDepreciationDate ?? formatDate.isoDate(new Date()),
    frequency: initialData?.frequency ?? DepreciationFrequency.MONTHLY,
    depreciationMethod:
      initialData?.depreciationMethod ?? DepreciationMethod.STRAIGHT_LINE,
  });

  const [formData, setFormData] = useState<DepreciationFormData>(
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
    showToastSuccess('Form Reset', 'Form Reset Succesfully', 'top-center');
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

  function validateConfiguration() {
    const { usefulLife, usefulLifeUnit, frequency, depreciationMethod } =
      formData;

    // Useful life check
    if (usefulLife <= 0) {
      showToastError(
        'Invalid Configuration',
        'Useful life must be greater than 0.',
        'bottom-right',
      );
      return false;
    }

    // Logical frequency vs. unit check
    if (
      usefulLifeUnit === UsefulLifeUnit.MONTHS &&
      frequency === DepreciationFrequency.ANNUAL
    ) {
      showToastError(
        'Invalid Frequency',
        'Cannot apply annual depreciation for assets with useful life in months.',
        'bottom-right',
      );
      return false;
    }

    if (
      usefulLifeUnit === UsefulLifeUnit.YEARS &&
      frequency === DepreciationFrequency.MONTHLY &&
      usefulLife < 1
    ) {
      showToastError(
        'Invalid Useful Life',
        'Monthly depreciation requires at least 1 year of useful life.',
        'bottom-right',
      );
      return false;
    }

    // Accelerated depreciation rule (optional business logic)
    if (
      depreciationMethod === DepreciationMethod.ACCELERATED &&
      usefulLife < 3
    ) {
      showToastError(
        'Invalid Depreciation Method',
        'Accelerated depreciation requires a useful life of at least 3 years.',
        'bottom-right',
      );
      return false;
    }

    return true;
  }

  async function submitData() {
    let response;

    if (mode === 'add') {
      // Create payload for API
      const payload: DepreciationRequest = {
        asset: formData.asset?.id ?? '', // Only ID
        usefulLife: formData.usefulLife,
        usefulLifeUnit: formData.usefulLifeUnit,
        salvageValue: formData.salvageValue,
        firstDepreciationDate: formData.firstDepreciationDate,
        frequency: formData.frequency,
        depreciationMethod: formData.depreciationMethod,
      };

      response = await createDepreciationRecord(payload);
    } else if (mode === 'edit' && initialData?.id) {
      // Get changed fields
      const updatedFields = getChangedFields(initialData, formData, {
        skipEmpty: true,
      });

      // Map changed fields to API payload
      const payload: Partial<DepreciationRequest> = {};

      if (updatedFields.asset) payload.asset = updatedFields.asset.id;
      if (updatedFields.usefulLife !== undefined)
        payload.usefulLife = updatedFields.usefulLife;
      if (updatedFields.usefulLifeUnit !== undefined)
        payload.usefulLifeUnit = updatedFields.usefulLifeUnit;
      if (updatedFields.salvageValue !== undefined)
        payload.salvageValue = updatedFields.salvageValue;
      if (updatedFields.firstDepreciationDate !== undefined)
        payload.firstDepreciationDate = updatedFields.firstDepreciationDate;
      if (updatedFields.frequency !== undefined)
        payload.frequency = updatedFields.frequency;
      if (updatedFields.depreciationMethod !== undefined)
        payload.depreciationMethod = updatedFields.depreciationMethod;

      if (Object.keys(payload).length > 0) {
        response = await updateAssetDepreciationRecord(initialData.id, payload);
      }
    }

    return response;
  }

  const handleSubmit = async (e?: React.FormEvent | boolean) => {
    if (typeof e !== 'boolean') e?.preventDefault();

    try {
      const response = await submitData();
      close();
      onSuccess?.();
      setError('');
    } catch (error: unknown) {
      showToastError(
        'Operation Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    } finally {
      setLoading(false);
    }
  };

  //Compute before/after preview data for FormPreviewer
  const previewData = useMemo(() => {
    if (mode === 'edit' && initialData) {
      // Compute the updated (after) data
      const updatedData = getChangedFields<
        DepreciationFormData,
        DepreciationPayload
      >(initialData, formData, { skipEmpty: true });

      const { ...filteredUpdatedData } = updatedData;
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

  // check if all required fields a filled
  const isFormValid = useMemo(() => {
    const {
      asset,
      usefulLife,
      usefulLifeUnit,
      salvageValue,
      firstDepreciationDate,
      // lastDepreciationDate,
      frequency,
      depreciationMethod,
    } = formData;

    // Check that all required fields are filled in properly
    return (
      asset &&
      typeof usefulLife === 'number' &&
      usefulLife > 0 &&
      usefulLifeUnit !== undefined &&
      typeof salvageValue === 'number' &&
      salvageValue >= 0 &&
      firstDepreciationDate.trim() !== '' &&
      // lastDepreciationDate.trim() !== '' &&
      frequency !== undefined &&
      depreciationMethod !== undefined
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
    validateConfiguration,
  };
}
