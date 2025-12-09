'use client';

import React, { useEffect, useState } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { BsFillPersonVcardFill } from 'react-icons/bs';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';
import { getAllStudentList } from '@/api/protected/student-api/student.api';

interface StudentPickerProps {
  value: any | null;
  onSelect: (role: any | null) => void;
}
export default function StudentPicker({ value, onSelect }: StudentPickerProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selected =
    value && students.length > 0
      ? students.find((e) => e.id === value.id) || null
      : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllStudentList(value?.id);
        const formatted = res.data.map((s) => ({
          ...s,
          label: `${s.personalInfo.firstName} ${
            s.personalInfo.middleName || ''
          } ${s.personalInfo.lastName}`,
        }));
        console.log('RESPONSE', res);
        // setStudents(res.data || []);
        setStudents(formatted);
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
      options={students}
      value={selected}
      onSelect={onSelect}
      searchKey={['label']}
      loading={loading}
      placeholder="Search students..."
      isClearable
      icon={<BsFillPersonVcardFill />}
    />
  );
}
