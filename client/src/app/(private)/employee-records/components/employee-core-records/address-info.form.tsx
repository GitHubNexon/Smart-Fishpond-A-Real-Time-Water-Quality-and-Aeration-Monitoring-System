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
import { User, Phone, Mail, MapPin, Hash } from 'lucide-react';
import AddressPicker from '@/components/customs/address-picker/address.picker';

interface AddressInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: any) => void;
  handleAddressChange: (field: string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function AddressInforForm({
  formData,
  handleChange,
  handleSelectChange,
  setFormData,
  handleAddressChange,
}: AddressInfoFormProps) {
  return (
    <FormSection
      title="Address Information"
      description="Employee's residential details"
      icon={<MapPin className="w-4 h-4" />}
    >
      <FormGrid columns={1}>
        {/* Use AddressPicker for region, province, city, barangay */}
        <AddressPicker
          values={{
            region: formData.addressInfo.region,
            province: formData.addressInfo.province,
            city: formData.addressInfo.city,
            barangay: formData.addressInfo.barangay,
          }}
          onChange={handleAddressChange}
          fieldPrefix="addressInfo"
        />
      </FormGrid>

      {/* Keep manual inputs for street and zipCode */}
      <FormGrid columns={2} className="mt-4">
        <FormField
          label="Street"
          icon={<MapPin className="w-4 h-4" />}
          helper="House number / street"
        >
          <Input
            id="street"
            name="addressInfo.street"
            value={formData.addressInfo.street}
            onChange={handleChange}
            placeholder="Street"
            className="h-11"
          />
        </FormField>
        <FormField
          label="Zip Code"
          icon={<Hash className="w-4 h-4" />}
          helper="Postal / zip code"
        >
          <Input
            id="zipCode"
            name="addressInfo.zipCode"
            value={formData.addressInfo.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="h-11"
          />
        </FormField>
      </FormGrid>
    </FormSection>
  );
}
