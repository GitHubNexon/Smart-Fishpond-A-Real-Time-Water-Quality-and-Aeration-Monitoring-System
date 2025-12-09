'use client';

import { useState, useMemo, useEffect } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { RoleFormData } from './role-form.interface';
import { createRole, updateRole } from '@/api/protected/rbac.api';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

export default function useRoleFormModalLogic(
  open: boolean,
  close: () => void,
  mode: 'add' | 'edit' = 'add',
  initialData: RoleFormData | null = null,
  onSuccess?: () => void,
) {
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );

  const [formData, setFormData] = useState<RoleFormData>({
    role: '',
    description: '',
  });

  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const defaultFormData: RoleFormData = {
    role: '',
    description: '',
  };

  const handleReset = () => {
    if (mode === 'add') {
      setFormData(defaultFormData);
    } else if (mode === 'edit' && initialData) {
      setFormData({
        role: initialData.role || '',
        description: initialData.description || '',
      });
    }
    showToastSuccess('Form Reset', 'Form Reset Successfully', 'top-center');
  };

  const dialogConfig = {
    close: {
      title: 'Discard changes?',
      description:
        'Are you sure you want to close this form? Unsaved changes will be lost.',
      proceed: 'Yes, Close',
      cancel: 'Cancel',
      icon: <IoWarningOutline className="w-8 h-8 text-yellow-500" />,
      action: () => close(),
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

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'add') {
        setFormData(defaultFormData);
      } else if (mode === 'edit' && initialData) {
        setFormData({
          role: initialData.role || '',
          description: initialData.description || '',
        });
      }
    }
  }, [open, mode, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    setLoading(true);
    try {
      let response;
      if (mode === 'add') {
        const payload = {
          ...formData,
        };
        response = await createRole(payload);
        showToastSuccess('Role Created', response.message, 'top-right');
      } else if (mode === 'edit' && initialData?.id) {
        const updatedData = {
          ...formData,
        };
        response = await updateRole(initialData.id, updatedData);
        showToastSuccess('Role Update', response.message, 'top-right');
      }
      close();
      onSuccess?.();
      setError('');
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      showToastError(
        'Operation failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
  };
}
