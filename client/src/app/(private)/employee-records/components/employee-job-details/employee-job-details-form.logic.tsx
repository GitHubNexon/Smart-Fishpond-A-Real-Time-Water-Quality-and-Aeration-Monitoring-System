//src/app/(private)/employee-records/components/employee-job-details/employee-job-details-form.logic.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { IoWarningOutline, IoRefreshOutline } from 'react-icons/io5';
import { showToastError, showToastSuccess } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import { formatDate } from '@syntaxsentinel/date-utils';
import {
  EmployeeJobDetailsFormData,
  EmployeeJobDetailsPayload,
} from './employee-job-details-form.interface';
import {
  EmploymentTypeEnum,
  EmploymentStatusEnum,
  TerminationReasonEnum,
} from '@/api/protected/job-details-api/job-details.enum';
import {
  createEmployeeJobDetails,
  updateEmployeeJobDetails,
} from '@/api/protected/job-details-api/employee-job-details.api';
import { EmployeeData } from '@/api/protected/employee-api/employee.interface';

export default function useEmployeeJobDetailsFormLogic(
  open: boolean,
  close: () => void,
  onSuccess?: () => void,
) {
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmType, setConfirmType] = useState<'close' | 'reset' | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [formData, setFormData] = useState<EmployeeJobDetailsFormData>({
    position: '',
    department: '',
    employmentType: EmploymentTypeEnum.PROBATION,
    employmentStatus: EmploymentStatusEnum.ACTIVE,
    dateHired: formatDate.dateTime(new Date()),
    dateRegularized: '',
    contractStartDate: '',
    probationPeriodEnd: '',
    resignedDate: '',
    resignationReason: '',
    resignationNotes: '',
    terminatedDate: '',
    terminationReason: TerminationReasonEnum.FOR_CAUSE,
    terminationNotes: '',
    retiredDate: '',
    retirementNotes: '',
    employee: '',
  });

  const defaultFormData: EmployeeJobDetailsFormData = {
    position: '',
    department: '',
    employmentType: EmploymentTypeEnum.PROBATION,
    employmentStatus: EmploymentStatusEnum.ACTIVE,
    dateHired: '',
    dateRegularized: '',
    contractStartDate: '',
    probationPeriodEnd: '',
    resignedDate: '',
    resignationReason: '',
    resignationNotes: '',
    terminatedDate: '',
    terminationReason: TerminationReasonEnum.FOR_CAUSE,
    terminationNotes: '',
    retiredDate: '',
    retirementNotes: '',
    employee: '',
  };

  useEffect(() => {
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employee: selectedEmployee.id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employee: '',
      }));
    }
  }, [selectedEmployee]);

  const handleEntrySelect = (type: EmploymentTypeEnum) => {
    setFormData({
      ...defaultFormData,
      employmentType: type,
      ...(type === EmploymentTypeEnum.PROBATION && {
        dateHired: formatDate.dateTime(new Date()),
        probationPeriodEnd: formatDate.dateTime(new Date()),
      }),
      ...(type === EmploymentTypeEnum.CONTRACT && {
        contractStartDate: formatDate.dateTime(new Date()),
        contractEndDate: formatDate.dateTime(new Date()),
      }),
      ...(type === EmploymentTypeEnum.REGULAR && {
        dateRegularized: formatDate.dateTime(new Date()),
      }),
      ...(type === EmploymentTypeEnum.PART_TIME && {
        dateHired: formatDate.dateTime(new Date()),
      }),
      ...(type === EmploymentTypeEnum.INTERN && {
        dateHired: formatDate.dateTime(new Date()),
      }),
      ...(type === EmploymentTypeEnum.PROJECT_BASED && {
        dateHired: formatDate.dateTime(new Date()),
      }),
    });
  };

  const handleStatusSelect = (status: EmploymentStatusEnum) => {
    setFormData({
      ...formData,
      employmentStatus: status,
      ...(status === EmploymentStatusEnum.RESIGNED && {
        resignedDate: formatDate.dateTime(new Date()),
        resignationReason: '',
        resignationNotes: '',
      }),
      ...(status === EmploymentStatusEnum.RETIRED && {
        retiredDate: formatDate.dateTime(new Date()),
        retirementNotes: '',
      }),
      ...(status === EmploymentStatusEnum.TERMINATED && {
        terminatedDate: formatDate.dateTime(new Date()),
        terminationReason: TerminationReasonEnum.WITHOUT_CAUSE,
        terminationNotes: '',
      }),
    });
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setSelectedEmployee(null);
    setIsConfirmed(false);
  };
}
