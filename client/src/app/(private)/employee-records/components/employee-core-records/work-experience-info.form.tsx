'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { Briefcase, Plus } from 'lucide-react';
import FormTable from '@/components/customs/form-table/form-table';
import { DatePicker } from '@/components/customs/date-picker';
import { EmployeeWorkExperienceInfo } from '@/api/protected/employee-api/employee.interface';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/utils/format-number.util';
import { useFormattedInput } from '@/hooks/useFormattedInput';

interface WorkExperienceFormProps {
  formData: {
    workExperienceInfo?: EmployeeWorkExperienceInfo[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function WorkExperienceForm({
  formData,
  setFormData,
}: WorkExperienceFormProps) {
  const [workForm, setWorkForm] = useState<EmployeeWorkExperienceInfo>({
    id: null,
    fromDate: '',
    toDate: '',
    position: '',
    companyName: '',
    employmentType: '',
    salary: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleNumericChange = (name: string, value: number | null) => {
    setWorkForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const salaryInput = useFormattedInput({
    name: 'salary',
    value: workForm.salary ?? 0,
    onChange: handleNumericChange,
    formatOptions: {
      type: 'currency',
      currency: 'PHP',
      locale: 'en-PH',
    },
  });

  const handleWorkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkForm((prev) => ({
      ...prev,
      [name]:
        name === 'salary' ? (value ? Number(value) : null) : value || null,
    }));
  };

  const handleDateChange = (name: string, date: string) => {
    setWorkForm((prev) => ({
      ...prev,
      [name]: date || null,
    }));
  };

  const handleAddOrUpdateWork = () => {
    // Validate required fields
    if (!workForm.position?.trim() || !workForm.fromDate?.trim()) {
      alert('Please fill in at least Position and From Date');
      return;
    }

    const workExperience = [...(formData.workExperienceInfo || [])];

    if (editingIndex !== null) {
      // Update existing work experience
      workExperience[editingIndex] = {
        ...workForm,
        id: workForm.id || crypto.randomUUID(),
      };
      setEditingIndex(null);
    } else {
      // Add new work experience
      workExperience.push({
        ...workForm,
        id: crypto.randomUUID(),
      });
    }

    setFormData((prev: any) => ({
      ...prev,
      workExperienceInfo: workExperience,
    }));

    // Reset form
    setWorkForm({
      id: null,
      fromDate: '',
      toDate: '',
      companyName: '',
      position: '',
      employmentType: '',
      salary: 0,
    });
  };

  const handleEditWork = (index: number, row: EmployeeWorkExperienceInfo) => {
    setWorkForm(row);
    setEditingIndex(index);
  };

  const handleDeleteWork = (indices: number[]) => {
    const workExperience = (formData.workExperienceInfo || []).filter(
      (_, index) => !indices.includes(index),
    );
    setFormData((prev: any) => ({
      ...prev,
      workExperienceInfo: workExperience,
    }));
  };

  const handleCancelEdit = () => {
    setWorkForm({
      id: null,
      fromDate: '',
      toDate: '',
      companyName: '',
      position: '',
      employmentType: '',
      salary: 0,
    });
    setEditingIndex(null);
  };
  const columns: Array<{
    key: keyof EmployeeWorkExperienceInfo;
    label: string;
    render?: (
      value: any,
      row: EmployeeWorkExperienceInfo,
      index: number,
    ) => React.ReactNode;
  }> = [
    {
      key: 'companyName',
      label: 'Company Name',
      render: (value: any) => value || '-',
    },
    {
      key: 'position',
      label: 'Position',
      render: (value: any) => value || '-',
    },
    {
      key: 'employmentType',
      label: 'Employment Type',
      render: (value: any) => value || '-',
    },
    {
      key: 'fromDate',
      label: 'From Date',
      render: (value: any) => (value ? formatDate.shortDate(value) : '-'),
    },
    {
      key: 'toDate',
      label: 'To Date',
      render: (value: any) => (value ? formatDate.shortDate(value) : 'Present'),
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (value: any) =>
        value
          ? formatNumber(value, {
              type: 'currency',
              currency: 'PHP',
              locale: 'en-PH',
            })
          : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <FormSection
        title="Add Work Experience"
        description="Add information about your previous work experience"
        icon={<Briefcase className="w-4 h-4" />}
      >
        <FormGrid columns={2}>
          <FormField label="Company Name" required>
            <Input
              name="companyName"
              value={workForm.companyName || ''}
              onChange={handleWorkInputChange}
              placeholder="Name of the Company"
            />
          </FormField>
          <FormField label="Position" required>
            <Input
              name="position"
              value={workForm.position || ''}
              onChange={handleWorkInputChange}
              placeholder="e.g., Software Engineer"
            />
          </FormField>

          <FormField label="Employment Type">
            <Input
              name="employmentType"
              value={workForm.employmentType || ''}
              onChange={handleWorkInputChange}
              placeholder="e.g., Full-time, Part-time, Contract"
            />
          </FormField>

          <FormField label="From Date" required>
            <DatePicker
              name="fromDate"
              value={workForm.fromDate || ''}
              onChange={(date) => handleDateChange('fromDate', date)}
              placeholder="Select start date"
            />
          </FormField>

          <FormField label="To Date">
            <DatePicker
              name="toDate"
              value={workForm.toDate || ''}
              onChange={(date) => handleDateChange('toDate', date)}
              placeholder="Leave empty if current position"
            />
          </FormField>

          <FormField label="Salary" className="col-span-2">
            <Input
              id="salary"
              {...salaryInput.inputProps}
              placeholder="₱ 0.00"
              className="h-11"
              required
            />
          </FormField>
        </FormGrid>

        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            onClick={handleAddOrUpdateWork}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {editingIndex !== null
              ? 'Update Work Experience'
              : 'Add Work Experience'}
          </Button>
          {editingIndex !== null && (
            <Button type="button" variant="outline" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>
      </FormSection>

      <FormTable
        data={formData.workExperienceInfo || []}
        columns={columns}
        onEdit={handleEditWork}
        onDelete={handleDeleteWork}
        selectable={true}
        emptyMessage="No work experience added yet"
        tableTitle="Work Experience List"
        getRowId={(row, index) => row.id || `work-${index}`}
        pageSize={5}
      />
    </div>
  );
}
