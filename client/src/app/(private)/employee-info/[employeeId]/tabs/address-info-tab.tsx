// src/(private)/employee/[employeeId]/tabs/address-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { EmployeeAddressInfo } from '@/api/protected/employee-api/employee.interface';
import { InfoField } from '../components/info-field';

interface AddressInfoTabProps {
  addressInfo?: EmployeeAddressInfo | null;
}

export default function AddressInfoTab({ addressInfo }: AddressInfoTabProps) {
  if (!addressInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
          <CardDescription>No address information available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </CardTitle>
        <CardDescription>Current residential address</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField label="Street" value={addressInfo.street} />
          <InfoField label="Barangay" value={addressInfo.barangay} />
          <InfoField label="City" value={addressInfo.city} />
          <InfoField label="Province" value={addressInfo.province} />
          <InfoField label="Region" value={addressInfo.region} />
          <InfoField label="ZIP Code" value={addressInfo.zipCode} />
        </div>
      </CardContent>
    </Card>
  );
}
