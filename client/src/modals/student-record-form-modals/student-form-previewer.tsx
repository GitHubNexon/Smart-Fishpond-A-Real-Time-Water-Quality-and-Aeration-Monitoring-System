// student-form-previewer.tsx

'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PreviewField } from '@/components/customs/preview-field';
import { Book, User, Phone, MapPin, GraduationCap } from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';

interface StudentFormPreviewerProps {
  mode: 'add' | 'edit';
  formData: any;
  initialData: any;
}

export default function StudentFormPreviewer({
  mode,
  formData,
  initialData,
}: StudentFormPreviewerProps) {
  return (
    <ScrollArea>
      <div className="h-full overflow-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* ----------------------- PERSONAL INFO ----------------------- */}
          {mode === 'edit' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Previous Personal Info
                </h3>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <PreviewField
                  label="Student ID"
                  value={initialData?.personalInfo.studentId}
                />
                <PreviewField
                  label="First Name"
                  value={initialData?.personalInfo.firstName}
                />
                <PreviewField
                  label="Middle Name"
                  value={initialData?.personalInfo.middleName}
                />
                <PreviewField
                  label="Last Name"
                  value={initialData?.personalInfo.lastName}
                />
                <PreviewField
                  label="Birth Date"
                  value={
                    initialData?.personalInfo.birthDate
                      ? formatDate.shortDate(initialData.personalInfo.birthDate)
                      : '-'
                  }
                />
                <PreviewField
                  label="Gender"
                  value={initialData?.personalInfo.gender}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                {mode === 'edit' ? 'New Personal Info' : 'Personal Info'}
              </h3>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <PreviewField
                label="Student ID"
                value={formData.personalInfo.studentId}
                changed={
                  formData.personalInfo.studentId !==
                  initialData?.personalInfo.studentId
                }
              />
              <PreviewField
                label="First Name"
                value={formData.personalInfo.firstName}
                changed={
                  formData.personalInfo.firstName !==
                  initialData?.personalInfo.firstName
                }
              />
              <PreviewField
                label="Middle Name"
                value={formData.personalInfo.middleName}
                changed={
                  formData.personalInfo.middleName !==
                  initialData?.personalInfo.middleName
                }
              />
              <PreviewField
                label="Last Name"
                value={formData.personalInfo.lastName}
                changed={
                  formData.personalInfo.lastName !==
                  initialData?.personalInfo.lastName
                }
              />
              <PreviewField
                label="Birth Date"
                value={formData.personalInfo.birthDate}
                changed={
                  formData.personalInfo.birthDate !==
                  initialData?.personalInfo.birthDate
                }
              />
              <PreviewField
                label="Gender"
                value={formData.personalInfo.gender}
                changed={
                  formData.personalInfo.gender !==
                  initialData?.personalInfo.gender
                }
              />
            </div>
          </div>

          {/* ----------------------- CONTACT INFO ----------------------- */}
          {mode === 'edit' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Previous Contact Info
                </h3>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <PreviewField
                  label="Contact Number"
                  value={initialData?.contactInfo.contactNumber}
                />
                <PreviewField
                  label="School Email"
                  value={initialData?.contactInfo.schoolEmail}
                />
                <PreviewField
                  label="Guardian Name"
                  value={initialData?.contactInfo.guardianName}
                />
                <PreviewField
                  label="Guardian Contact Number"
                  value={initialData?.contactInfo.guardianContactNumber}
                />
                <PreviewField
                  label="Guardian Relationship"
                  value={initialData?.contactInfo.guardianRelationship}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                {mode === 'edit' ? 'New Contact Info' : 'Contact Info'}
              </h3>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <PreviewField
                label="Contact Number"
                value={formData.contactInfo.contactNumber}
                changed={
                  formData.contactInfo.contactNumber !==
                  initialData?.contactInfo.contactNumber
                }
              />
              <PreviewField
                label="School Email"
                value={formData.contactInfo.schoolEmail}
                changed={
                  formData.contactInfo.schoolEmail !==
                  initialData?.contactInfo.schoolEmail
                }
              />
              <PreviewField
                label="Guardian Name"
                value={formData.contactInfo.guardianName}
                changed={
                  formData.contactInfo.guardianName !==
                  initialData?.contactInfo.guardianName
                }
              />
              <PreviewField
                label="Guardian Contact Number"
                value={formData.contactInfo.guardianContactNumber}
                changed={
                  formData.contactInfo.guardianContactNumber !==
                  initialData?.contactInfo.guardianContactNumber
                }
              />
              <PreviewField
                label="Guardian Relationship"
                value={formData.contactInfo.guardianRelationship}
                changed={
                  formData.contactInfo.guardianRelationship !==
                  initialData?.contactInfo.guardianRelationship
                }
              />
            </div>
          </div>

          {/* ----------------------- ADDRESS INFO ----------------------- */}
          {mode === 'edit' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Previous Address Info
                </h3>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <PreviewField
                  label="Street"
                  value={initialData?.addressInfo.street}
                />
                <PreviewField
                  label="Barangay"
                  value={initialData?.addressInfo.barangay}
                />
                <PreviewField
                  label="City"
                  value={initialData?.addressInfo.city}
                />
                <PreviewField
                  label="Province"
                  value={initialData?.addressInfo.province}
                />
                <PreviewField
                  label="Zip Code"
                  value={initialData?.addressInfo.zipCode}
                />
                <PreviewField
                  label="Region"
                  value={initialData?.addressInfo.region}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                {mode === 'edit' ? 'New Address Info' : 'Address Info'}
              </h3>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <PreviewField
                label="Street"
                value={formData.addressInfo.street}
                changed={
                  formData.addressInfo.street !==
                  initialData?.addressInfo.street
                }
              />
              <PreviewField
                label="Barangay"
                value={formData.addressInfo.barangay}
                changed={
                  formData.addressInfo.barangay !==
                  initialData?.addressInfo.barangay
                }
              />
              <PreviewField
                label="City"
                value={formData.addressInfo.city}
                changed={
                  formData.addressInfo.city !== initialData?.addressInfo.city
                }
              />
              <PreviewField
                label="Province"
                value={formData.addressInfo.province}
                changed={
                  formData.addressInfo.province !==
                  initialData?.addressInfo.province
                }
              />
              <PreviewField
                label="Zip Code"
                value={formData.addressInfo.zipCode}
                changed={
                  formData.addressInfo.zipCode !==
                  initialData?.addressInfo.zipCode
                }
              />
              <PreviewField
                label="Region"
                value={formData.addressInfo.region}
                changed={
                  formData.addressInfo.region !==
                  initialData?.addressInfo.region
                }
              />
            </div>
          </div>

          {/* ----------------------- ACADEMIC INFO ----------------------- */}
          {mode === 'edit' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Previous Academic Info
                </h3>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                <PreviewField
                  label="Education Level"
                  value={initialData?.academicInfo.educationLevel}
                />
                <PreviewField
                  label="Section"
                  value={initialData?.academicInfo.section}
                />
                <PreviewField
                  label="Grade Level"
                  value={initialData?.academicInfo.gradeLevel}
                />
                <PreviewField
                  label="Year Level"
                  value={initialData?.academicInfo.yearLevel}
                />
                <PreviewField
                  label="Course Name"
                  value={initialData?.academicInfo.courseId?.name}
                />
                <PreviewField
                  label="Strand ID"
                  value={initialData?.academicInfo.strandId}
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                {mode === 'edit' ? 'New Academic Info' : 'Academic Info'}
              </h3>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <PreviewField
                label="Education Level"
                value={formData.academicInfo.educationLevel}
                changed={
                  formData.academicInfo.educationLevel !==
                  initialData?.academicInfo.educationLevel
                }
              />
              <PreviewField
                label="Section"
                value={formData.academicInfo.section}
                changed={
                  formData.academicInfo.section !==
                  initialData?.academicInfo.section
                }
              />
              <PreviewField
                label="Grade Level"
                value={formData.academicInfo.gradeLevel}
                changed={
                  formData.academicInfo.gradeLevel !==
                  initialData?.academicInfo.gradeLevel
                }
              />
              <PreviewField
                label="Year Level"
                value={formData.academicInfo.yearLevel}
                changed={
                  formData.academicInfo.yearLevel !==
                  initialData?.academicInfo.yearLevel
                }
              />
              <PreviewField
                label="Course Name"
                value={formData.academicInfo.courseId?.name || '-'}
                changed={
                  formData.academicInfo.courseId !==
                  initialData?.academicInfo.courseId?.name
                }
              />
              <PreviewField
                label="Strand ID"
                value={formData.academicInfo.strandId}
                changed={
                  formData.academicInfo.strandId !==
                  initialData?.academicInfo.strandId
                }
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
