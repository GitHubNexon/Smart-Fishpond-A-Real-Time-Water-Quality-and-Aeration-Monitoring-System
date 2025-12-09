// src/(private)/employee/[employeeId]/tabs/contact-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail } from 'lucide-react';
import { EmployeeContactInfo } from '@/api/protected/employee-api/employee.interface';
import { InfoField } from '../components/info-field';

interface ContactInfoTabProps {
  contactInfo?: EmployeeContactInfo | null;
}

export default function ContactInfoTab({ contactInfo }: ContactInfoTabProps) {
  if (!contactInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>No contact information available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Contact details and emergency contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            label="Contact Number"
            value={contactInfo.contactNo}
            icon={<Phone className="h-4 w-4" />}
          />
          <InfoField
            label="Email Address"
            value={contactInfo.contactEmail}
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        <Separator className="my-6" />

        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            label="Emergency Contact Name"
            value={contactInfo.emergenecyContactName}
          />
          <InfoField
            label="Emergency Contact Number"
            value={contactInfo.emergencyContactNo}
            icon={<Phone className="h-4 w-4" />}
          />
          <InfoField
            label="Relationship"
            value={contactInfo.emergencyRelationship}
          />
        </div>
      </CardContent>
    </Card>
  );
}
