// src/(private)/employee/[employeeId]/employee-profile.component.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  GraduationCap,
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';
import { getEmployeeById } from '@/api/protected/employee.api';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { EmployeeData } from '@/api/protected/employee-api/employee.interface';

import PersonalInfoTab from './tabs/personal-info-tab';
import ContactInfoTab from './tabs/contact-info-tab';
import AddressInfoTab from './tabs/address-info-tab';
import GovernmentInfoTab from './tabs/government-info-tab';
import FamilyInfoTab from './tabs/family-info-tab';
import EducationInfoTab from './tabs/education-info-tab';
import WorkInfoTab from './tabs/work-info-tab';

interface EmployeeProfileProps {
  employeeId: string;
}

export default function EmployeeProfile({ employeeId }: EmployeeProfileProps) {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeById(employeeId);
        setEmployee(response.data);
        showToastSuccess(
          'Employee Profile Loaded',
          'Data loaded successfully',
          'top-left',
        );
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        console.error('Failed to fetch employee:', errorMessage);
        showToastError('Failed to fetch employee', errorMessage, 'top-center');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Get the latest coreWorkInfo
  const coreWork = employee?.coreWorkInfo?.[0] || null;

  const currentPosition = coreWork?.position || 'N/A';
  const currentDepartment = coreWork?.department || 'N/A';
  const currentEmploymentType = coreWork?.employmentType || 'N/A';

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Not Found</CardTitle>
            <CardDescription>
              The employee with ID {employeeId} could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const fullName = [
    employee.personalInfo?.firstName,
    employee.personalInfo?.middleName,
    employee.personalInfo?.lastName,
    employee.personalInfo?.suffix,
  ]
    .filter(Boolean)
    .join(' ');

  const isActive = !employee.deletedAt;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-2xl ring-4 ring-primary/10 shadow-xl">
              <AvatarImage
                src={
                  employee.user?.profileImage ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`
                }
                alt={fullName}
                className="object-cover rounded-2xl"
              />
              <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-2xl">
                {employee.personalInfo?.firstName?.charAt(0)}
                {employee.personalInfo?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                    {fullName}
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Employee ID: {employee.employeeId}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className="text-xs md:text-sm"
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge
                    variant={employee.isVerified ? 'default' : 'outline'}
                    className="text-xs md:text-sm"
                  >
                    {employee.isVerified ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Not Verified
                      </>
                    )}
                  </Badge>
                  <Badge
                    variant={employee.isApproved ? 'default' : 'outline'}
                    className="text-xs md:text-sm"
                  >
                    {employee.isApproved ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Approved
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Not Approved
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Position: {currentPosition}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Department: {currentDepartment}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Employment Type: {currentEmploymentType}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {employee.contactInfo?.contactEmail || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.contactInfo?.contactNo || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined{' '}
                    {employee.createdAt
                      ? formatDate.shortDate(employee.createdAt)
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 h-auto gap-2 bg-muted/50 p-2">
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-background"
          >
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-background"
          >
            <Phone className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger
            value="address"
            className="data-[state=active]:bg-background"
          >
            <MapPin className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Address</span>
          </TabsTrigger>
          <TabsTrigger
            value="government"
            className="data-[state=active]:bg-background"
          >
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Government</span>
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="data-[state=active]:bg-background"
          >
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Family</span>
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="data-[state=active]:bg-background"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger
            value="work"
            className="data-[state=active]:bg-background"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Work</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab personalInfo={employee.personalInfo} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactInfoTab contactInfo={employee.contactInfo} />
        </TabsContent>

        <TabsContent value="address">
          <AddressInfoTab addressInfo={employee.addressInfo} />
        </TabsContent>

        <TabsContent value="government">
          <GovernmentInfoTab governmentInfo={employee.governmentInfo} />
        </TabsContent>

        <TabsContent value="family">
          <FamilyInfoTab familyInfo={employee.familyInfo} />
        </TabsContent>

        <TabsContent value="education">
          <EducationInfoTab educationalInfo={employee.educationalInfo} />
        </TabsContent>

        <TabsContent value="work">
          <WorkInfoTab
            workExperienceInfo={employee.workExperienceInfo}
            coreWorkInfo={employee.coreWorkInfo}
          />
        </TabsContent>
      </Tabs>

      {/* Metadata Footer */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Record Created</p>
              <p className="font-medium">
                {employee.createdAt &&
                  formatDate.readableDateTime(employee.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                {employee.createdAt &&
                  formatDate.relativeTime(employee.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Modified</p>
              <p className="font-medium">
                {employee.updatedAt &&
                  formatDate.readableDateTime(employee.updatedAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                {employee.updatedAt &&
                  formatDate.relativeTime(employee.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Record Version</p>
              <p className="font-medium">v{employee.version || 1}</p>
              <p className="text-xs text-muted-foreground">
                Database ID: {employee.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
