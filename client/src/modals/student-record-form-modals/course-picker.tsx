'use client';

import React, { useEffect, useState } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastError, showToastSuccess } from '@/utils/toast-config';
import { getAllCoursesList } from '@/api/protected/academic-api/academic.api';
import { GraduationCap } from 'lucide-react';

interface CoursePickerProps {
  value: any | null;
  onSelect: (role: any | null) => void;
}

export default function CoursePicker({ value, onSelect }: CoursePickerProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selected =
    value && courses.length > 0
      ? courses.find((e) => e.id === value.id) || null
      : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllCoursesList();
        setCourses(res.data || []);
      } catch (e) {
        const message = extractErrorMessage(e);
        showToastError(
          'Operation Failed',
          extractErrorMessage(e),
          'bottom-left',
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return (
    <ComboBox
      options={courses}
      value={selected}
      onSelect={onSelect}
      searchKey={['name']}
      loading={loading}
      placeholder="Search course..."
      isClearable
      icon={<GraduationCap />}
    />
  );
}
