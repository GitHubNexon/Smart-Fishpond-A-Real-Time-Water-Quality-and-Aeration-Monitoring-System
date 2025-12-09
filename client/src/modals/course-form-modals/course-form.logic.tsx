'use client';

import { useState, useMemo, useEffect, useId } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import {
  createCourse,
  updateCourse,
} from '@/api/protected/academic-api/academic.api';
import { formatDate } from '@syntaxsentinel/date-utils';
import createDialogConfig from '@/utils/create-dialog-config';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

interface CourseFormData {
  id?: string;
  name: string;
  description: string;
}

interface CourseFormPayload {
  id?: string;
  name: string;
  description: string;
}

export default function useCourseFormLogic(
  open: boolean,
  close: () => void,
  mode: 'add' | 'edit' = 'add',
  initialData: CourseFormData | null = null,
  onSuccess?: () => void,
) {
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );

  const getInitialFormData = (
    initialData?: CourseFormData | null,
  ): CourseFormData => ({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
  });

  const [formData, setFormData] = useState<CourseFormData>(
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

  async function submitData() {
    let response;
    if (mode === 'add') {
      response = await createCourse(formData);
    } else if (mode === 'edit' && initialData?.id) {
      const updatedData = getChangedFields(initialData, formData, {
        skipEmpty: true,
      });
      if (Object.keys(updatedData).length > 0) {
        response = await updateCourse(initialData.id, updatedData);
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

  const previewData = useMemo(() => {
    if (mode === 'edit' && initialData) {
      // Compute the updated (after) data
      const updatedData = getChangedFields<CourseFormData, CourseFormPayload>(
        initialData,
        formData,
        { skipEmpty: true },
      );

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

  const isFormValid = useMemo(() => {
    const { name, description } = formData;
    return name.trim() !== '' && description.trim();
  }, [formData]);

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
    previewData,
    isFormValid,
    hasChanges,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
  };
}
