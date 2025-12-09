'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { IdCard, ShieldCheck, Landmark, FileText } from 'lucide-react';

interface GovernmentInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function GovernmentInfoForm({
  formData,
  handleChange,
}: GovernmentInfoFormProps) {
  return (
    <FormSection
      title="Government Information"
      description="Employee government-issued numbers and IDs"
      icon={<IdCard className="w-4 h-4" />}
    >
      <FormGrid columns={3}>
        <FormField
          label="SSS Number"
          required
          icon={<IdCard className="w-4 h-4" />}
          helper="Social Security System number"
        >
          <Input
            id="sss"
            name="governmentInfo.sss"
            value={formData.governmentInfo.sss}
            onChange={handleChange}
            placeholder="SSS Number"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="Pag-IBIG Number"
          required
          icon={<Landmark className="w-4 h-4" />}
          helper="HDMF Pag-IBIG number"
        >
          <Input
            id="pagIbig"
            name="governmentInfo.pagIbig"
            value={formData.governmentInfo.pagIbig}
            onChange={handleChange}
            placeholder="Pag-IBIG Number"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="PhilHealth Number"
          required
          icon={<ShieldCheck className="w-4 h-4" />}
          helper="PhilHealth ID number"
        >
          <Input
            id="philHealth"
            name="governmentInfo.philHealth"
            value={formData.governmentInfo.philHealth}
            onChange={handleChange}
            placeholder="PhilHealth Number"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="TIN"
          required
          icon={<FileText className="w-4 h-4" />}
          helper="Tax Identification Number"
        >
          <Input
            id="tin"
            name="governmentInfo.tin"
            value={formData.governmentInfo.tin}
            onChange={handleChange}
            placeholder="TIN"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="Passport Number"
          icon={<IdCard className="w-4 h-4" />}
          helper="Optional"
        >
          <Input
            id="passportNo"
            name="governmentInfo.passportNo"
            value={formData.governmentInfo.passportNo}
            onChange={handleChange}
            placeholder="Passport Number"
            className="h-11"
          />
        </FormField>

        <FormField
          label="Driver’s License"
          icon={<IdCard className="w-4 h-4" />}
          helper="Optional"
        >
          <Input
            id="driversLicense"
            name="governmentInfo.driversLicense"
            value={formData.governmentInfo.driversLicense}
            onChange={handleChange}
            placeholder="Driver’s License Number"
            className="h-11"
          />
        </FormField>

        <FormField
          label="Postal ID"
          icon={<IdCard className="w-4 h-4" />}
          helper="Optional"
        >
          <Input
            id="postalId"
            name="governmentInfo.postalId"
            value={formData.governmentInfo.postalId}
            onChange={handleChange}
            placeholder="Postal ID Number"
            className="h-11"
          />
        </FormField>

        <FormField
          label="Voter’s ID"
          icon={<IdCard className="w-4 h-4" />}
          helper="Optional"
        >
          <Input
            id="votersId"
            name="governmentInfo.votersId"
            value={formData.governmentInfo.votersId}
            onChange={handleChange}
            placeholder="Voter’s ID Number"
            className="h-11"
          />
        </FormField>

        <FormField
          label="NBI Clearance"
          icon={<ShieldCheck className="w-4 h-4" />}
          helper="Optional"
        >
          <Input
            id="nbi"
            name="governmentInfo.nbi"
            value={formData.governmentInfo.nbi}
            onChange={handleChange}
            placeholder="NBI Clearance Number"
            className="h-11"
          />
        </FormField>

        <FormField
          label="Police Clearance"
          icon={<ShieldCheck className="w-4 h-4" />}
          helper="Optional"
        >
          <Input
            id="policeClearance"
            name="governmentInfo.policeClearance"
            value={formData.governmentInfo.policeClearance}
            onChange={handleChange}
            placeholder="Police Clearance Number"
            className="h-11"
          />
        </FormField>
      </FormGrid>
    </FormSection>
  );
}
