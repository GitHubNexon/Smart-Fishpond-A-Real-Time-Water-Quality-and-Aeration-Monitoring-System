'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { User, Phone, Mail } from 'lucide-react';

interface ContactInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ContactInfoForm({
  formData,
  handleChange,
  handleSelectChange,
  setFormData,
}: ContactInfoFormProps) {
  return (
    <FormSection
      title="Contact Information"
      description="Employee contact and emergency information"
      icon={<Phone className="w-4 h-4" />}
    >
      <FormGrid columns={3}>
        <FormField
          label="Contact Number"
          required
          icon={<Phone className="w-4 h-4" />}
          helper="Primary phone number"
        >
          <Input
            id="contactNo"
            name="contactInfo.contactNo"
            value={formData.contactInfo.contactNo}
            onChange={handleChange}
            placeholder="Contact Number"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="Email"
          required
          icon={<Mail className="w-4 h-4" />}
          helper="Primary email address"
        >
          <Input
            id="contactEmail"
            name="contactInfo.contactEmail"
            value={formData.contactInfo.contactEmail}
            onChange={handleChange}
            placeholder="Email"
            className="h-11"
            type="email"
            required
          />
        </FormField>

        <FormField
          label="Emergency Contact Name"
          required
          icon={<User className="w-4 h-4" />}
          helper="Name of emergency contact"
        >
          <Input
            id="emergencyContactName"
            name="contactInfo.emergencyContactName"
            value={formData.contactInfo.emergencyContactName}
            onChange={handleChange}
            placeholder="Emergency Contact Name"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="Emergency Contact Number"
          required
          icon={<Phone className="w-4 h-4" />}
          helper="Phone number of emergency contact"
        >
          <Input
            id="emergencyContactNo"
            name="contactInfo.emergencyContactNo"
            value={formData.contactInfo.emergencyContactNo}
            onChange={handleChange}
            placeholder="Emergency Contact Number"
            className="h-11"
            required
          />
        </FormField>

        <FormField
          label="Emergency Relationship"
          required
          icon={<User className="w-4 h-4" />}
          helper="Relationship to emergency contact"
        >
          <Input
            id="emergencyRelationship"
            name="contactInfo.emergencyRelationship"
            value={formData.contactInfo.emergencyRelationship}
            onChange={handleChange}
            placeholder="Relationship"
            className="h-11"
            required
          />
        </FormField>
      </FormGrid>
    </FormSection>
  );
}
