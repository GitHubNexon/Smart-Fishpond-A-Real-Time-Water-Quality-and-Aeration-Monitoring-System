'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Phone,
  MapPin,
  FileText,
  Users,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';

// Safe date formatter
const formatSafeDate = (date: any) => {
  if (!date) return '-';
  try {
    return formatDate.shortDate(date);
  } catch {
    return '-';
  }
};

// PreviewField Component
const PreviewField = ({ label, value, changed = false }) => {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span
        className={`text-sm font-medium text-right ${
          changed ? 'text-primary' : 'text-foreground'
        }`}
      >
        {value ?? '-'}
      </span>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, isPrevious = false }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isPrevious ? 'bg-muted' : 'bg-primary/10'
        }`}
      >
        <Icon
          className={`w-4 h-4 ${
            isPrevious ? 'text-muted-foreground' : 'text-primary'
          }`}
        />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  );
};

export default function EmployeeFormPreviewer({ mode, formData, initialData }) {
  const renderSection = (
    title,
    icon,
    currentData,
    previousData,
    fields,
    isPrevious = false,
  ) => {
    return (
      <div className="space-y-3">
        <SectionHeader icon={icon} title={title} isPrevious={isPrevious} />
        <div
          className={`rounded-lg p-4 space-y-2 ${
            isPrevious
              ? 'bg-muted/50 border border-border'
              : 'bg-primary/5 border border-primary/20'
          }`}
        >
          {fields.map(({ label, key, format }) => {
            const rawValue = currentData?.[key];
            const value = format ? format(rawValue) : rawValue;

            const prevValue = previousData?.[key];
            const changed =
              mode === 'edit' && !isPrevious && value !== prevValue;

            return (
              <PreviewField
                key={key}
                label={label}
                value={value}
                changed={changed}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
        <TabsTrigger value="government">Government</TabsTrigger>
        <TabsTrigger value="family">Family</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="work">Work</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[300px] mt-4">
        <div className="pr-4">
          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            {mode === 'edit' &&
              renderSection(
                'Previous Personal Info',
                User,
                initialData?.personalInfo,
                null,
                [
                  { label: 'Employee ID', key: 'employeeId' },
                  { label: 'First Name', key: 'firstName' },
                  { label: 'Middle Name', key: 'middleName' },
                  { label: 'Last Name', key: 'lastName' },
                  { label: 'Suffix', key: 'suffix' },
                  {
                    label: 'Birth Date',
                    key: 'birthDate',
                    format: formatSafeDate,
                  },
                  { label: 'Gender', key: 'gender' },
                  { label: 'Civil Status', key: 'civilStatus' },
                  { label: 'Blood Type', key: 'bloodType' },
                  { label: 'Height (cm)', key: 'height' },
                  { label: 'Weight (kg)', key: 'weight' },
                  { label: 'Citizenship', key: 'citizenship' },
                ],
                true,
              )}

            {renderSection(
              mode === 'edit' ? 'New Personal Info' : 'Personal Info',
              User,
              formData?.personalInfo,
              initialData?.personalInfo,
              [
                { label: 'First Name', key: 'firstName' },
                { label: 'Middle Name', key: 'middleName' },
                { label: 'Last Name', key: 'lastName' },
                { label: 'Suffix', key: 'suffix' },
                {
                  label: 'Birth Date',
                  key: 'birthDate',
                  format: formatSafeDate,
                },
                { label: 'Gender', key: 'gender' },
                { label: 'Civil Status', key: 'civilStatus' },
                { label: 'Blood Type', key: 'bloodType' },
                { label: 'Height (cm)', key: 'height' },
                { label: 'Weight (kg)', key: 'weight' },
                { label: 'Citizenship', key: 'citizenship' },
              ],
            )}
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact" className="space-y-6">
            {mode === 'edit' &&
              renderSection(
                'Previous Contact Info',
                Phone,
                initialData?.contactInfo,
                null,
                [
                  { label: 'Contact Number', key: 'contactNo' },
                  { label: 'Email', key: 'contactEmail' },
                  {
                    label: 'Emergency Contact Name',
                    key: 'emergenecyContactName',
                  },
                  {
                    label: 'Emergency Contact Number',
                    key: 'emergencyContactNo',
                  },
                  {
                    label: 'Emergency Relationship',
                    key: 'emergencyRelationship',
                  },
                ],
                true,
              )}

            {renderSection(
              mode === 'edit' ? 'New Contact Info' : 'Contact Info',
              Phone,
              formData?.contactInfo,
              initialData?.contactInfo,
              [
                { label: 'Contact Number', key: 'contactNo' },
                { label: 'Email', key: 'contactEmail' },
                {
                  label: 'Emergency Contact Name',
                  key: 'emergenecyContactName',
                },
                {
                  label: 'Emergency Contact Number',
                  key: 'emergencyContactNo',
                },
                {
                  label: 'Emergency Relationship',
                  key: 'emergencyRelationship',
                },
              ],
            )}
          </TabsContent>

          {/* Address Info Tab */}
          <TabsContent value="address" className="space-y-6">
            {mode === 'edit' &&
              renderSection(
                'Previous Address Info',
                MapPin,
                initialData?.addressInfo,
                null,
                [
                  { label: 'Street', key: 'street' },
                  { label: 'Barangay', key: 'barangay' },
                  { label: 'City', key: 'city' },
                  { label: 'Province', key: 'province' },
                  { label: 'Region', key: 'region' },
                  { label: 'Zip Code', key: 'zipCode' },
                ],
                true,
              )}

            {renderSection(
              mode === 'edit' ? 'New Address Info' : 'Address Info',
              MapPin,
              formData?.addressInfo,
              initialData?.addressInfo,
              [
                { label: 'Street', key: 'street' },
                { label: 'Barangay', key: 'barangay' },
                { label: 'City', key: 'city' },
                { label: 'Province', key: 'province' },
                { label: 'Region', key: 'region' },
                { label: 'Zip Code', key: 'zipCode' },
              ],
            )}
          </TabsContent>

          {/* Government Info Tab */}
          <TabsContent value="government" className="space-y-6">
            {mode === 'edit' &&
              renderSection(
                'Previous Government IDs',
                FileText,
                initialData?.governmentInfo,
                null,
                [
                  { label: 'SSS', key: 'sss' },
                  { label: 'Pag-IBIG', key: 'pagIbig' },
                  { label: 'PhilHealth', key: 'philHealth' },
                  { label: 'TIN', key: 'tin' },
                  { label: 'Passport No.', key: 'passportNo' },
                  { label: "Driver's License", key: 'driversLicense' },
                  { label: 'Postal ID', key: 'postalId' },
                  { label: "Voter's ID", key: 'votersId' },
                  { label: 'NBI Clearance', key: 'nbi' },
                  { label: 'Police Clearance', key: 'policeClearance' },
                ],
                true,
              )}

            {renderSection(
              mode === 'edit' ? 'New Government IDs' : 'Government IDs',
              FileText,
              formData?.governmentInfo,
              initialData?.governmentInfo,
              [
                { label: 'SSS', key: 'sss' },
                { label: 'Pag-IBIG', key: 'pagIbig' },
                { label: 'PhilHealth', key: 'philHealth' },
                { label: 'TIN', key: 'tin' },
                { label: 'Passport No.', key: 'passportNo' },
                { label: "Driver's License", key: 'driversLicense' },
                { label: 'Postal ID', key: 'postalId' },
                { label: "Voter's ID", key: 'votersId' },
                { label: 'NBI Clearance', key: 'nbi' },
                { label: 'Police Clearance', key: 'policeClearance' },
              ],
            )}
          </TabsContent>

          {/* Family Info Tab */}
          <TabsContent value="family" className="space-y-6">
            {mode === 'edit' && (
              <>
                <div className="space-y-3">
                  <SectionHeader
                    icon={Users}
                    title="Previous Spouse Info"
                    isPrevious={true}
                  />
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <PreviewField
                      label="First Name"
                      value={initialData?.familyInfo?.spouseFirstName}
                    />
                    <PreviewField
                      label="Middle Name"
                      value={initialData?.familyInfo?.spouseMiddleName}
                    />
                    <PreviewField
                      label="Last Name"
                      value={initialData?.familyInfo?.spouseLastName}
                    />
                    <PreviewField
                      label="Suffix"
                      value={initialData?.familyInfo?.spouseSuffix}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <SectionHeader
                    icon={Users}
                    title="Previous Father Info"
                    isPrevious={true}
                  />
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <PreviewField
                      label="First Name"
                      value={initialData?.familyInfo?.fatherFirstName}
                    />
                    <PreviewField
                      label="Middle Name"
                      value={initialData?.familyInfo?.fatherMiddleName}
                    />
                    <PreviewField
                      label="Last Name"
                      value={initialData?.familyInfo?.fatherLastName}
                    />
                    <PreviewField
                      label="Suffix"
                      value={initialData?.familyInfo?.fatherSuffix}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <SectionHeader
                    icon={Users}
                    title="Previous Mother Info"
                    isPrevious={true}
                  />
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <PreviewField
                      label="First Name"
                      value={initialData?.familyInfo?.motherFirstName}
                    />
                    <PreviewField
                      label="Middle Name"
                      value={initialData?.familyInfo?.motherMiddleName}
                    />
                    <PreviewField
                      label="Last Name"
                      value={initialData?.familyInfo?.motherLastName}
                    />
                    <PreviewField
                      label="Maiden Name"
                      value={initialData?.familyInfo?.motherMaidenName}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-3">
              <SectionHeader
                icon={Users}
                title={mode === 'edit' ? 'New Spouse Info' : 'Spouse Info'}
              />
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                <PreviewField
                  label="First Name"
                  value={formData?.familyInfo?.spouseFirstName}
                  changed={
                    formData?.familyInfo?.spouseFirstName !==
                    initialData?.familyInfo?.spouseFirstName
                  }
                />
                <PreviewField
                  label="Middle Name"
                  value={formData?.familyInfo?.spouseMiddleName}
                  changed={
                    formData?.familyInfo?.spouseMiddleName !==
                    initialData?.familyInfo?.spouseMiddleName
                  }
                />
                <PreviewField
                  label="Last Name"
                  value={formData?.familyInfo?.spouseLastName}
                  changed={
                    formData?.familyInfo?.spouseLastName !==
                    initialData?.familyInfo?.spouseLastName
                  }
                />
                <PreviewField
                  label="Suffix"
                  value={formData?.familyInfo?.spouseSuffix}
                  changed={
                    formData?.familyInfo?.spouseSuffix !==
                    initialData?.familyInfo?.spouseSuffix
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <SectionHeader
                icon={Users}
                title={mode === 'edit' ? 'New Father Info' : 'Father Info'}
              />
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                <PreviewField
                  label="First Name"
                  value={formData?.familyInfo?.fatherFirstName}
                  changed={
                    formData?.familyInfo?.fatherFirstName !==
                    initialData?.familyInfo?.fatherFirstName
                  }
                />
                <PreviewField
                  label="Middle Name"
                  value={formData?.familyInfo?.fatherMiddleName}
                  changed={
                    formData?.familyInfo?.fatherMiddleName !==
                    initialData?.familyInfo?.fatherMiddleName
                  }
                />
                <PreviewField
                  label="Last Name"
                  value={formData?.familyInfo?.fatherLastName}
                  changed={
                    formData?.familyInfo?.fatherLastName !==
                    initialData?.familyInfo?.fatherLastName
                  }
                />
                <PreviewField
                  label="Suffix"
                  value={formData?.familyInfo?.fatherSuffix}
                  changed={
                    formData?.familyInfo?.fatherSuffix !==
                    initialData?.familyInfo?.fatherSuffix
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <SectionHeader
                icon={Users}
                title={mode === 'edit' ? 'New Mother Info' : 'Mother Info'}
              />
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                <PreviewField
                  label="First Name"
                  value={formData?.familyInfo?.motherFirstName}
                  changed={
                    formData?.familyInfo?.motherFirstName !==
                    initialData?.familyInfo?.motherFirstName
                  }
                />
                <PreviewField
                  label="Middle Name"
                  value={formData?.familyInfo?.motherMiddleName}
                  changed={
                    formData?.familyInfo?.motherMiddleName !==
                    initialData?.familyInfo?.motherMiddleName
                  }
                />
                <PreviewField
                  label="Last Name"
                  value={formData?.familyInfo?.motherLastName}
                  changed={
                    formData?.familyInfo?.motherLastName !==
                    initialData?.familyInfo?.motherLastName
                  }
                />
                <PreviewField
                  label="Maiden Name"
                  value={formData?.familyInfo?.motherMaidenName}
                  changed={
                    formData?.familyInfo?.motherMaidenName !==
                    initialData?.familyInfo?.motherMaidenName
                  }
                />
              </div>
            </div>

            {formData?.familyInfo?.children?.length > 0 && (
              <div className="space-y-3">
                <SectionHeader icon={Users} title="Children" />
                <div className="space-y-2">
                  {formData.familyInfo.children.map((child, index) => (
                    <div
                      key={index}
                      className="bg-primary/5 border border-primary/20 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-sm mb-2">
                        Child {index + 1}
                      </h4>
                      <div className="space-y-2">
                        <PreviewField label="Name" value={child.name} />
                        <PreviewField
                          label="Birth Date"
                          value={formatSafeDate(child.birthDate)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Education Info Tab */}
          <TabsContent value="education" className="space-y-6">
            {['Elementary', 'High School', 'College', 'Masters', 'PhD'].map(
              (level) => {
                const key = level.toLowerCase().replace(' ', '');
                return (
                  <div key={level} className="space-y-3">
                    <SectionHeader
                      icon={GraduationCap}
                      title={mode === 'edit' ? `New ${level}` : level}
                    />
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                      <PreviewField
                        label="Completed"
                        value={formData?.educationalInfo?.[key] ? 'Yes' : 'No'}
                        changed={
                          formData?.educationalInfo?.[key] !==
                          initialData?.educationalInfo?.[key]
                        }
                      />

                      <PreviewField
                        label="School Name"
                        value={formData?.educationalInfo?.[`${key}SchoolName`]}
                        changed={
                          formData?.educationalInfo?.[`${key}SchoolName`] !==
                          initialData?.educationalInfo?.[`${key}SchoolName`]
                        }
                      />

                      <PreviewField
                        label="Year Graduated"
                        value={
                          formData?.educationalInfo?.[`${key}YearGraduated`] ||
                          '-'
                        }
                        changed={
                          formData?.educationalInfo?.[`${key}YearGraduated`] !==
                          initialData?.educationalInfo?.[`${key}YearGraduated`]
                        }
                      />

                      {(key === 'college' ||
                        key === 'masters' ||
                        key === 'phd') && (
                        <PreviewField
                          label="Course"
                          value={formData?.educationalInfo?.[`${key}Course`]}
                          changed={
                            formData?.educationalInfo?.[`${key}Course`] !==
                            initialData?.educationalInfo?.[`${key}Course`]
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </TabsContent>

          {/* Work Experience Tab */}
          <TabsContent value="work" className="space-y-6">
            <SectionHeader icon={Briefcase} title="Work Experience" />

            {formData?.workExperienceInfo?.length > 0 ? (
              <div className="space-y-4">
                {formData.workExperienceInfo.map((work, index) => (
                  <div
                    key={index}
                    className="bg-primary/5 border border-primary/20 rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-3">Experience {index + 1}</h4>

                    <div className="space-y-2">
                      <PreviewField
                        label="Company Name"
                        value={work.companyName}
                      />

                      <PreviewField label="Position" value={work.position} />

                      <PreviewField
                        label="From Date"
                        value={formatSafeDate(work.fromDate)}
                      />

                      <PreviewField
                        label="To Date"
                        value={
                          work.toDate ? formatSafeDate(work.toDate) : 'Present'
                        }
                      />

                      <PreviewField
                        label="Employment Type"
                        value={work.employmentType}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No work experience added
              </div>
            )}
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  );
}
