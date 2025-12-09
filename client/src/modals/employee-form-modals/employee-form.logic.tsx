'use client';

import { useState, useMemo, useEffect, useId } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import { EmployeeFormData, EmployeePayload } from './emlployee-form.interface';
import { createEmployee, updateEmployee } from '@/api/protected/employee.api';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

export default function useEmployeeFormLogic(
  open: boolean,
  close: () => void,
  mode: 'add' | 'edit' = 'add',
  initialData: EmployeeFormData | null = null,
  onSuccess?: () => void,
) {
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );

  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    position: '',
    department: '',
  });
  const defaultFormData: EmployeeFormData = {
    employeeId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    position: '',
    department: '',
  };
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState('');
  const [contactNoError, setContactNoError] = useState<string>('');

  const handleReset = () => {
    if (mode === 'add') {
      setFormData(defaultFormData);
    } else if (mode === 'edit' && initialData) {
      setFormData({
        employeeId: initialData.employeeId || '',
        firstName: initialData.firstName || '',
        middleName: initialData.middleName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        contactNumber: initialData.contactNumber || '',
        position: initialData.position || '',
        department: initialData.department || '',
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Invalid email format');
    return isValid;
  };
  // Initialize or reset form when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'add') {
        setFormData(defaultFormData);
      } else if (mode === 'edit' && initialData) {
        setFormData({
          employeeId: initialData.employeeId || '',
          firstName: initialData.firstName || '',
          middleName: initialData.middleName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          contactNumber: initialData.contactNumber || '',
          position: initialData.position || '',
          department: initialData.department || '',
        });
      }
      setEmailError('');
      setContactNoError('');
    }
  }, [open, mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'email' ? value.toLowerCase() : value;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(formattedValue) ? '' : 'Invalid email format',
      );
    }
  };

  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('63')) {
      value = value.slice(2);
    } else if (value.startsWith('0')) {
      value = value.slice(1);
    }
    value = value.slice(0, 10);

    let formatted = '+63';
    if (value.length > 0) formatted += ' ' + value.substring(0, 3);
    if (value.length > 3) formatted += ' ' + value.substring(3, 6);
    if (value.length > 6) formatted += ' ' + value.substring(6, 10);

    setFormData((prev) => ({ ...prev, contactNumber: formatted }));

    // Validate if complete
    if (value.length !== 10) {
      setContactNoError('Contact number must be 10 digits after +63');
    } else {
      setContactNoError('');
    }
  };

  const validateData = (): boolean => {
    const requiredFields: { key: keyof EmployeeFormData; label: string }[] = [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'contactNumber', label: 'Contact Number' },
      { key: 'position', label: 'Position' },
      { key: 'department', label: 'Department' },
    ];

    // Check empty required fields
    const missingFields = requiredFields.filter(
      (f) => !formData[f.key] || formData[f.key].trim() === '',
    );

    if (missingFields.length > 0) {
      const firstMissing = missingFields[0];
      showToastError(
        'Missing Field',
        `${firstMissing.label} is required.`,
        'bottom-right',
      );
      return false;
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      showToastError(
        'Invalid Email',
        'Please enter a valid email address.',
        'bottom-right',
      );
      return false;
    }

    // Contact number validation
    const digits = formData.contactNumber.replace(/\D/g, '');
    if (digits.length !== 12 || !digits.startsWith('63')) {
      showToastError(
        'Invalid Contact Number',
        'Contact number must be 10 digits.',
        'bottom-right',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // if (!validateEmail(formData.email)) return;
    if (!validateData()) return;
    setLoading(true);
    try {
      let response;
      let dataId: string;
      if (mode === 'add') {
        const { ...rest } = formData;
        const payload: EmployeePayload = {
          ...rest,
        };
        response = await createEmployee(payload);
        console.log(payload);
      } else if (mode === 'edit' && initialData?.id) {
        dataId = initialData.id;
        const { ...rest } = formData;
        const rawUpdate = {
          ...rest,
        };
        const updateData = getChangedFields<EmployeeFormData, EmployeePayload>(
          initialData,
          rawUpdate,
          { skipEmpty: true },
        );
        const hasDataChanges = Object.keys(updateData).length > 0;
        if (hasDataChanges) {
          response = await updateEmployee(dataId, updateData);
          console.log('UPDATED DATA', updateData);
        }
      }
      showToastSuccess(
        mode === 'add' ? 'Employee Created' : 'Employee Updated',
        response?.message || 'Operation completed successfully',
        'top-right',
      );

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
    emailError,
    setEmailError,
    handleChange,
    handleContactNumberChange,
    contactNoError,
    setContactNoError,
  };
}
