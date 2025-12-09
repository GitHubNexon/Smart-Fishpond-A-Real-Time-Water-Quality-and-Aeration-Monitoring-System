// src/(private)/employee/[employeeId]/tabs/government-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { EmployeeGovernmentInfo } from '@/api/protected/employee-api/employee.interface';
import { InfoField } from '../components/info-field';

interface GovernmentInfoTabProps {
  governmentInfo?: EmployeeGovernmentInfo | null;
}

export default function GovernmentInfoTab({
  governmentInfo,
}: GovernmentInfoTabProps) {
  if (!governmentInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Government Information
          </CardTitle>
          <CardDescription>No government information available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Government Information
        </CardTitle>
        <CardDescription>
          Government IDs and identification numbers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField label="SSS" value={governmentInfo.sss} />
          <InfoField label="Pag-IBIG" value={governmentInfo.pagIbig} />
          <InfoField label="PhilHealth" value={governmentInfo.philHealth} />
          <InfoField label="TIN" value={governmentInfo.tin} />
          <InfoField label="Passport No." value={governmentInfo.passportNo} />
          <InfoField
            label="Driver's License"
            value={governmentInfo.driversLicense}
          />
          <InfoField label="Postal ID" value={governmentInfo.postalId} />
          <InfoField label="Voter's ID" value={governmentInfo.votersId} />
          <InfoField label="NBI Clearance" value={governmentInfo.nbi} />
          <InfoField
            label="Police Clearance"
            value={governmentInfo.policeClearance}
          />
        </div>
      </CardContent>
    </Card>
  );
}
