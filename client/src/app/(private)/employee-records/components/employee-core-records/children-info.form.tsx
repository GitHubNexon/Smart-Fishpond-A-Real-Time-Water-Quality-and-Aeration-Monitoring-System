'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { Users, Plus } from 'lucide-react';
import FormTable from '@/components/customs/form-table/form-table';
import { EmployeeChildInfo } from '@/api/protected/employee-api/employee.interface';

interface ChildrenInfoFormProps {
  formData: {
    familyInfo?: {
      children?: EmployeeChildInfo[]; 
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}
export default function ChildrenInfoForm({
  formData,
  setFormData,
}: ChildrenInfoFormProps) {
  const [childForm, setChildForm] = useState<EmployeeChildInfo>({
    id: null,
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChildInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChildForm((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleAddOrUpdateChild = () => {
    // Validate required fields
    if (!childForm.firstName?.trim() || !childForm.lastName?.trim()) {
      alert('Please fill in at least First Name and Last Name');
      return;
    }

    const children = [...(formData.familyInfo.children || [])];

    if (editingIndex !== null) {
      // Update existing child
      children[editingIndex] = {
        ...childForm,
        id: childForm.id || crypto.randomUUID(),
      };
      setEditingIndex(null);
    } else {
      // Add new child
      children.push({
        ...childForm,
        id: crypto.randomUUID(),
      });
    }

    setFormData((prev: any) => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        children,
      },
    }));

    // Reset form
    setChildForm({
      id: null,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
    });
  };

  const handleEditChild = (index: number, row: EmployeeChildInfo) => {
    setChildForm(row);
    setEditingIndex(index);
  };

  const handleDeleteChildren = (indices: number[]) => {
    const children = formData.familyInfo.children.filter(
      (_, index) => !indices.includes(index),
    );
    setFormData((prev: any) => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        children,
      },
    }));
  };

  const handleCancelEdit = () => {
    setChildForm({
      id: null,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
    });
    setEditingIndex(null);
  };

  const columns: Array<{
    key: keyof EmployeeChildInfo;
    label: string;
    render?: (
      value: any,
      row: EmployeeChildInfo,
      index: number,
    ) => React.ReactNode;
  }> = [
    {
      key: 'firstName',
      label: 'First Name',
      render: (value: any) => value || '-',
    },
    {
      key: 'middleName',
      label: 'Middle Name',
      render: (value: any) => value || '-',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      render: (value: any) => value || '-',
    },
    {
      key: 'suffix',
      label: 'Suffix',
      render: (value: any) => value || '-',
    },
  ];

  return (
    <div className="space-y-6">
      <FormSection
        title="Add Child Information"
        description="Add information about your children"
        icon={<Users className="w-4 h-4" />}
      >
        <FormGrid columns={2}>
          <FormField label="First Name" required>
            <Input
              name="firstName"
              value={childForm.firstName || ''}
              onChange={handleChildInputChange}
              placeholder="Enter first name"
            />
          </FormField>

          <FormField label="Middle Name">
            <Input
              name="middleName"
              value={childForm.middleName || ''}
              onChange={handleChildInputChange}
              placeholder="Enter middle name"
            />
          </FormField>

          <FormField label="Last Name" required>
            <Input
              name="lastName"
              value={childForm.lastName || ''}
              onChange={handleChildInputChange}
              placeholder="Enter last name"
            />
          </FormField>

          <FormField label="Suffix">
            <Input
              name="suffix"
              value={childForm.suffix || ''}
              onChange={handleChildInputChange}
              placeholder="Jr., Sr., III, etc."
            />
          </FormField>
        </FormGrid>

        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            onClick={handleAddOrUpdateChild}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            {editingIndex !== null ? 'Update Child' : 'Add Child'}
          </Button>
          {editingIndex !== null && (
            <Button type="button" variant="outline" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>
      </FormSection>

      <FormTable
        data={formData.familyInfo.children || []}
        columns={columns}
        onEdit={handleEditChild}
        onDelete={handleDeleteChildren}
        selectable={true}
        emptyMessage="No children added yet"
        tableTitle="Children List"
        getRowId={(row, index) => row.id || `child-${index}`}
        pageSize={5}
      />
    </div>
  );
}
