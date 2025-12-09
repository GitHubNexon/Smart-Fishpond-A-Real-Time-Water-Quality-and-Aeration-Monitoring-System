'use client';

import React, { useEffect, useState } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { BsFillPersonVcardFill } from 'react-icons/bs';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';
import { getAllEmployeeList } from '@/api/protected/employee.api';

interface EmployeePickerProps {
  value: any | null;
  onSelect: (role: any | null) => void;
}
export default function EmployeePicker({
  value,
  onSelect,
}: EmployeePickerProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selected =
    value && employees.length > 0
      ? employees.find((e) => e.id === value.id) || null
      : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllEmployeeList(value?.id);
        setEmployees(res.data || []);
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error({
          title: 'Operation failed',
          description: message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <ComboBox
      options={employees}
      value={selected}
      onSelect={onSelect}
      searchKey={['firstName', 'middleName', 'lastName']}
      loading={loading}
      placeholder="Search employees..."
      isClearable
      icon={<BsFillPersonVcardFill />}
    />
  );
}
