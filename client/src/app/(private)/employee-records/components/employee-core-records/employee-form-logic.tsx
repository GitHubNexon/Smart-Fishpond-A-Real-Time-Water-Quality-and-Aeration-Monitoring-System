'use client';

import { useState, useMemo, useEffect, useId } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { getChangedFields } from '@/utils/form-data.helper';
import { formatDate } from '@syntaxsentinel/date-utils';
import createDialogConfig from '@/utils/create-dialog-config';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import {
  createEmployee,
  updateEmployee,
} from '@/api/protected/employee-api/employee.api';
import { EmployeeFormData, EmployeePayload } from './employee-form.interface';
import {
  CivilStatusEnum,
  GenderEnum,
  BloodTypeEnum,
} from '@/api/protected/employee-api/enums/employee.enum';

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

  const getInitialFormData = (
    initialData?: EmployeeFormData | null,
  ): EmployeeFormData => ({
    employeeId: initialData?.employeeId ?? '',

    personalInfo: {
      firstName: initialData?.personalInfo?.firstName ?? '',
      middleName: initialData?.personalInfo?.middleName ?? '',
      lastName: initialData?.personalInfo?.lastName ?? '',
      suffix: initialData?.personalInfo?.suffix ?? '',
      birthDate:
        initialData?.personalInfo?.birthDate ?? formatDate.dateTime(new Date()),
      gender: initialData?.personalInfo?.gender ?? GenderEnum.OTHER,
      civilStatus:
        initialData?.personalInfo?.civilStatus ?? CivilStatusEnum.SINGLE,
      bloodType:
        initialData?.personalInfo?.bloodType ?? BloodTypeEnum.O_POSITIVE,
      height: initialData?.personalInfo?.height ?? 0,
      weight: initialData?.personalInfo?.weight ?? 0,
      citizenship: initialData?.personalInfo?.citizenship ?? '',
    },

    contactInfo: {
      contactNo: initialData?.contactInfo?.contactNo ?? '',
      contactEmail: initialData?.contactInfo?.contactEmail ?? '',
      emergencyContactNo: initialData?.contactInfo?.emergencyContactNo ?? '',
      emergenecyContactName:
        initialData?.contactInfo?.emergenecyContactName ?? '',
      emergencyRelationship:
        initialData?.contactInfo?.emergencyRelationship ?? '',
    },

    addressInfo: {
      zipCode: initialData?.addressInfo?.zipCode ?? '',
      street: initialData?.addressInfo?.street ?? '',
      barangay: initialData?.addressInfo?.barangay ?? '',
      city: initialData?.addressInfo?.city ?? '',
      province: initialData?.addressInfo?.province ?? '',
      region: initialData?.addressInfo?.region ?? '',
    },

    governmentInfo: {
      sss: initialData?.governmentInfo?.sss ?? '',
      pagIbig: initialData?.governmentInfo?.pagIbig ?? '',
      philHealth: initialData?.governmentInfo?.philHealth ?? '',
      tin: initialData?.governmentInfo?.tin ?? '',
      passportNo: initialData?.governmentInfo?.passportNo ?? '',
      driversLicense: initialData?.governmentInfo?.driversLicense ?? '',
      postalId: initialData?.governmentInfo?.postalId ?? '',
      votersId: initialData?.governmentInfo?.votersId ?? '',
      nbi: initialData?.governmentInfo?.nbi ?? '',
      policeClearance: initialData?.governmentInfo?.policeClearance ?? '',
    },

    familyInfo: {
      spouseFirstName: initialData?.familyInfo?.spouseFirstName ?? '',
      spouseMiddleName: initialData?.familyInfo?.spouseMiddleName ?? '',
      spouseLastName: initialData?.familyInfo?.spouseLastName ?? '',
      spouseSuffix: initialData?.familyInfo?.spouseSuffix ?? '',
      fatherFirstName: initialData?.familyInfo?.fatherFirstName ?? '',
      fatherMiddleName: initialData?.familyInfo?.fatherMiddleName ?? '',
      fatherLastName: initialData?.familyInfo?.fatherLastName ?? '',
      fatherSuffix: initialData?.familyInfo?.fatherSuffix ?? '',
      motherFirstName: initialData?.familyInfo?.motherFirstName ?? '',
      motherMiddleName: initialData?.familyInfo?.motherMiddleName ?? '',
      motherLastName: initialData?.familyInfo?.motherLastName ?? '',
      motherMaidenName: initialData?.familyInfo?.motherMaidenName ?? '',
      children: initialData?.familyInfo?.children ?? [],
    },

    educationalInfo: {
      elementary: initialData?.educationalInfo?.elementary ?? '',
      elementarySchoolName:
        initialData?.educationalInfo?.elementarySchoolName ?? '',
      elementaryYearGraduated:
        initialData?.educationalInfo?.elementaryYearGraduated ?? '',
      highSchool: initialData?.educationalInfo?.highSchool ?? '',
      highSchoolName: initialData?.educationalInfo?.highSchoolName ?? '',
      highSchoolYearGraduated:
        initialData?.educationalInfo?.highSchoolYearGraduated ?? '',
      college: initialData?.educationalInfo?.college ?? '',
      collegeSchoolName: initialData?.educationalInfo?.collegeSchoolName ?? '',
      collegeYearGraduated:
        initialData?.educationalInfo?.collegeYearGraduated ?? '',
      collegeCourse: initialData?.educationalInfo?.collegeCourse ?? '',
      masters: initialData?.educationalInfo?.masters ?? '',
      mastersSchoolName: initialData?.educationalInfo?.mastersSchoolName ?? '',
      mastersYearGraduated:
        initialData?.educationalInfo?.mastersYearGraduated ?? '',
      mastersCourse: initialData?.educationalInfo?.mastersCourse ?? '',
      phd: initialData?.educationalInfo?.phd ?? '',
      phdSchoolName: initialData?.educationalInfo?.phdSchoolName ?? '',
      phdYearGraduated: initialData?.educationalInfo?.phdYearGraduated ?? '',
      phdCourse: initialData?.educationalInfo?.phdCourse ?? '',
    },

    workExperienceInfo: initialData?.workExperienceInfo ?? [],
  });

  const [formData, setFormData] = useState<EmployeeFormData>(
    getInitialFormData(initialData),
  );

  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [contactNoError, setContactNoError] = useState<string>('');

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
    const keys = name.split('.');

    setFormData((prev) => {
      const updated = { ...prev };
      let obj: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }; // ensure immutability
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const keys = name.split('.');
      const updated = { ...prev };

      let obj: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleNumericChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    // setFormData((prev) => ({ ...prev, contactNumber: formatted }));
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        contactNo: formatted,
      },
    }));

    // Validate if complete
    if (value.length !== 10) {
      setContactNoError('Contact number must be 10 digits after +63');
    } else {
      setContactNoError('');
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    const keys = field.split('.');
    setFormData((prev) => {
      const updated = { ...prev };
      let obj: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  async function submitData() {
    let payload = formData;
    let response;
    if (mode === 'add') {
      response = await createEmployee(payload);
      console.log('CREATION: FORM DATA', payload);
    } else if (mode === 'edit' && initialData?.id) {
      const updatedData = getChangedFields(initialData, formData, {
        skipEmpty: true,
        normalizeEmpty: true,
      });

      if (Object.keys(updatedData).length === 0) {
        showToastError('No Changes', 'No fields were modified', 'bottom-right');
        throw new Error('No changes detected');
      }

      if (Object.keys(updatedData).length > 0) {
        response = await updateEmployee(initialData.id, updatedData);
      }
      console.log('UPDATE: FORM DATA', updatedData);
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
      const updatedData = getChangedFields<EmployeeFormData, EmployeePayload>(
        initialData,
        formData,
        {
          skipEmpty: true,
          normalizeEmpty: true,
        },
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
    const { personalInfo } = formData;

    return (
      personalInfo.firstName.trim() !== '' &&
      personalInfo.lastName.trim() !== '' &&
      personalInfo.gender !== undefined
    );
  }, [formData]);

  const hasChanges = useMemo(() => {
    if (mode === 'add') return true;
    if (!initialData) return false;
    const updatedFields = getChangedFields(initialData, formData, {
      skipEmpty: true,
      normalizeEmpty: true,
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
    handleSelectChange,
    handleNumericChange,
    handleContactNumberChange,
    handleAddressChange,
  };
}
