'use client';

import React, { useEffect, useState } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { BsFillPersonVcardFill } from 'react-icons/bs';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';
import { getAllCustodians } from '@/api/protected/employee.api';

interface CustodianPickerProps {
  // value: string | null; // pass the employee id, not a custom object
  value: any | null;
  onSelect: (employee: any | null) => void;
}

export default function CustodianPicker({
  value,
  onSelect,
}: CustodianPickerProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllCustodians(); 
        setEmployees(res.data || []);
      } catch (e) {
        toast.error({
          title: 'Operation failed',
          description: extractErrorMessage(e),
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // find the full employee object for the selected value
  const selectedEmployee = value
    ? employees.find((e) => e.id === value) || null
    : null;

  return (
    <ComboBox
      options={employees}
      value={selectedEmployee} // must be the actual object from employees
      // onSelect={(emp) => onSelect(emp ? emp.id : null)} // send back only id
      onSelect={(emp) => onSelect(emp || null)} // return the full object
      searchKey={['firstName', 'middleName', 'lastName']}
      loading={loading}
      placeholder="Search employees..."
      isClearable
      icon={<BsFillPersonVcardFill />}
      getOptionLabel={(emp: any) => `${emp.firstName} ${emp.lastName}`} // display full name
    />
  );
}
