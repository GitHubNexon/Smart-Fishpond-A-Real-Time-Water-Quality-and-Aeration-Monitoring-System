// src/(private)/employee/[employeeId]/tabs/personal-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User, Calendar, Heart, Activity } from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';
import { EmployeePersonalInfo } from '@/api/protected/employee-api/employee.interface';
import { InfoField } from '../components/info-field';

interface PersonalInfoTabProps {
  personalInfo?: EmployeePersonalInfo | null;
}

export default function PersonalInfoTab({
  personalInfo,
}: PersonalInfoTabProps) {
  if (!personalInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>No personal information available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Basic personal details and identification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField label="First Name" value={personalInfo.firstName} />
          <InfoField label="Middle Name" value={personalInfo.middleName} />
          <InfoField label="Last Name" value={personalInfo.lastName} />
          <InfoField label="Suffix" value={personalInfo.suffix} />
          <InfoField
            label="Birth Date"
            value={
              personalInfo.birthDate
                ? formatDate.shortDate(personalInfo.birthDate)
                : null
            }
            icon={<Calendar className="h-4 w-4" />}
          />
          <InfoField label="Gender" value={personalInfo.gender} />
          <InfoField label="Civil Status" value={personalInfo.civilStatus} />
          <InfoField
            label="Blood Type"
            value={personalInfo.bloodType}
            icon={<Heart className="h-4 w-4" />}
          />
          <InfoField
            label="Height"
            value={personalInfo.height ? `${personalInfo.height} cm` : null}
            icon={<Activity className="h-4 w-4" />}
          />
          <InfoField
            label="Weight"
            value={personalInfo.weight ? `${personalInfo.weight} kg` : null}
            icon={<Activity className="h-4 w-4" />}
          />
          <InfoField label="Citizenship" value={personalInfo.citizenship} />
        </div>
      </CardContent>
    </Card>
  );
}
