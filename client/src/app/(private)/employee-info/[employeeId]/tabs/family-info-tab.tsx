// src/(private)/employee/[employeeId]/tabs/family-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users } from 'lucide-react';
import { EmployeeFamilyInfo } from '@/api/protected/employee-api/employee.interface';
import { InfoField } from '../components/info-field';

interface FamilyInfoTabProps {
  familyInfo?: EmployeeFamilyInfo | null;
}

export default function FamilyInfoTab({ familyInfo }: FamilyInfoTabProps) {
  if (!familyInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Information
          </CardTitle>
          <CardDescription>No family information available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Information
        </CardTitle>
        <CardDescription>Family members and dependents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spouse */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Spouse Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoField label="First Name" value={familyInfo.spouseFirstName} />
            <InfoField
              label="Middle Name"
              value={familyInfo.spouseMiddleName}
            />
            <InfoField label="Last Name" value={familyInfo.spouseLastName} />
            <InfoField label="Suffix" value={familyInfo.spouseSuffix} />
          </div>
        </div>

        <Separator />

        {/* Father */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Father's Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoField label="First Name" value={familyInfo.fatherFirstName} />
            <InfoField
              label="Middle Name"
              value={familyInfo.fatherMiddleName}
            />
            <InfoField label="Last Name" value={familyInfo.fatherLastName} />
            <InfoField label="Suffix" value={familyInfo.fatherSuffix} />
          </div>
        </div>

        <Separator />

        {/* Mother */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Mother's Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoField label="First Name" value={familyInfo.motherFirstName} />
            <InfoField
              label="Middle Name"
              value={familyInfo.motherMiddleName}
            />
            <InfoField label="Last Name" value={familyInfo.motherLastName} />
            <InfoField
              label="Maiden Name"
              value={familyInfo.motherMaidenName}
            />
          </div>
        </div>

        <Separator />

        {/* Children */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Children</h3>
          {familyInfo.children && familyInfo.children.length > 0 ? (
            <div className="space-y-4">
              {familyInfo.children.map((child, index) => (
                <Card key={child.id || index} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <InfoField
                        label="First Name"
                        value={child.firstName}
                        compact
                      />
                      <InfoField
                        label="Middle Name"
                        value={child.middleName}
                        compact
                      />
                      <InfoField
                        label="Last Name"
                        value={child.lastName}
                        compact
                      />
                      <InfoField label="Suffix" value={child.suffix} compact />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No children information available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
