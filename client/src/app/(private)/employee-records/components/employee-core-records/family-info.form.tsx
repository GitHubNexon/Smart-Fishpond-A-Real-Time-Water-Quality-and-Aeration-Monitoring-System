'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { User } from 'lucide-react';

interface FamilyInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function FamilyInfoForm({
  formData,
  handleChange,
}: FamilyInfoFormProps) {
  return (
    <>
      {/* SPOUSE INFORMATION */}
      <FormSection
        title="Spouse Information"
        description="Basic personal information of spouse"
        icon={<User className="w-4 h-4" />}
        className="mb-5"
      >
        <FormGrid columns={3}>
          <FormField label="First Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="spouseFirstName"
              name="familyInfo.spouseFirstName"
              value={formData.familyInfo.spouseFirstName}
              onChange={handleChange}
              placeholder="First Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Middle Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="spouseMiddleName"
              name="familyInfo.spouseMiddleName"
              value={formData.familyInfo.spouseMiddleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Last Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="spouseLastName"
              name="familyInfo.spouseLastName"
              value={formData.familyInfo.spouseLastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Suffix" icon={<User className="w-4 h-4" />}>
            <Input
              id="spouseSuffix"
              name="familyInfo.spouseSuffix"
              value={formData.familyInfo.spouseSuffix}
              onChange={handleChange}
              placeholder="Jr / Sr / III"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* FATHER INFORMATION */}
      <FormSection
        title="Father Information"
        description="Details of employee's father"
        icon={<User className="w-4 h-4" />}
        className="mb-5"
      >
        <FormGrid columns={3}>
          <FormField label="First Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="fatherFirstName"
              name="familyInfo.fatherFirstName"
              value={formData.familyInfo.fatherFirstName}
              onChange={handleChange}
              placeholder="First Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Middle Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="fatherMiddleName"
              name="familyInfo.fatherMiddleName"
              value={formData.familyInfo.fatherMiddleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Last Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="fatherLastName"
              name="familyInfo.fatherLastName"
              value={formData.familyInfo.fatherLastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Suffix" icon={<User className="w-4 h-4" />}>
            <Input
              id="fatherSuffix"
              name="familyInfo.fatherSuffix"
              value={formData.familyInfo.fatherSuffix}
              onChange={handleChange}
              placeholder="Jr / Sr / III"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* MOTHER INFORMATION */}
      <FormSection
        title="Mother Information"
        description="Details of employee's mother (include maiden name)"
        icon={<User className="w-4 h-4" />}
      >
        <FormGrid columns={3}>
          <FormField label="First Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="motherFirstName"
              name="familyInfo.motherFirstName"
              value={formData.familyInfo.motherFirstName}
              onChange={handleChange}
              placeholder="First Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Middle Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="motherMiddleName"
              name="familyInfo.motherMiddleName"
              value={formData.familyInfo.motherMiddleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="h-11"
            />
          </FormField>

          <FormField label="Last Name" icon={<User className="w-4 h-4" />}>
            <Input
              id="motherLastName"
              name="familyInfo.motherLastName"
              value={formData.familyInfo.motherLastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Maiden Name"
            icon={<User className="w-4 h-4" />}
            helper="Mother's last name at birth"
          >
            <Input
              id="motherMaidenName"
              name="familyInfo.motherMaidenName"
              value={formData.familyInfo.motherMaidenName}
              onChange={handleChange}
              placeholder="Maiden Name"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>
    </>
  );
}
