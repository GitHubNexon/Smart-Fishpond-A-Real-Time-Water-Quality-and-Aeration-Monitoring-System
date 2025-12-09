// student-form-tabs.tsx

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
import { DatePicker } from '@/components/customs/date-picker';
import FormTab, { TabItem } from '@/components/customs/form-tab';
import AddressPicker from '@/components/customs/address-picker/address.picker';
import { User, Phone, MapPin, GraduationCap } from 'lucide-react';
import {
  GenderEnum,
  EducationLevel,
} from '@/api/protected/student-api/enums/student.enum';
import {
  Package,
  FileText,
  Factory,
  DollarSign,
  Hash,
  Calendar,
  Shield,
  RotateCcw,
  Eye,
  PhilippinePeso,
  Paperclip,
  Mail,
} from 'lucide-react';
import CoursePicker from './course-picker';

export default function StudentFormTabs({
  formData,
  handleChange,
  handleContactNumberChange,
  handleSelectChange,
  setFormData,
  handleAddressChange,
}: ReturnType<typeof import('./student-record-form.logic').default>) {
  const formTabs: TabItem[] = [
    {
      value: 'personal',
      label: 'Personal',
      icon: User,
      content: (
        <FormSection
          title="Personal Information"
          description="Basic details about the student"
          icon={<User className="w-4 h-4" />}
        >
          <FormGrid columns={2}>
            <FormField
              label="Student ID"
              required
              icon={<Hash className="w-4 h-4" />}
              helper="Unique ID for the student"
            >
              <Input
                id="studentId"
                name="personalInfo.studentId"
                value={formData.personalInfo.studentId}
                onChange={handleChange}
                placeholder="Student ID"
                className="h-11"
                required
              />
            </FormField>
            <FormField
              label="First Name"
              required
              icon={<User className="w-4 h-4" />}
              helper="Student’s given first name"
            >
              <Input
                id="firstName"
                name="personalInfo.firstName"
                value={formData.personalInfo.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="h-11"
                required
              />
            </FormField>
            <FormField
              label="Middle Name"
              icon={<User className="w-4 h-4" />}
              helper="Optional middle name"
            >
              <Input
                id="middleName"
                name="personalInfo.middleName"
                value={formData.personalInfo.middleName}
                onChange={handleChange}
                placeholder="Middle Name"
                className="h-11"
              />
            </FormField>
            <FormField
              label="Last Name"
              required
              icon={<User className="w-4 h-4" />}
              helper="Student’s surname"
            >
              <Input
                id="lastName"
                name="personalInfo.lastName"
                value={formData.personalInfo.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="h-11"
                required
              />
            </FormField>
            <FormField
              label="Birth Date"
              icon={<Calendar className="w-4 h-4" />}
              required
              helper="Date of acquisition"
            >
              <DatePicker
                name="personalInfo.birthDate"
                value={formData.personalInfo.birthDate}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      birthDate: val,
                    },
                  }))
                }
                required
              />
            </FormField>

            <FormField
              label="Gender"
              required
              icon={<Eye className="w-4 h-4" />}
              helper="Select biological gender"
            >
              <Select
                value={formData.personalInfo.gender}
                onValueChange={(value) =>
                  handleSelectChange('personalInfo.gender', value)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GenderEnum).map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormGrid>
        </FormSection>
      ),
    },
    {
      value: 'contact',
      label: 'Contact',
      icon: Phone,
      content: (
        <FormSection
          title="Contact Information"
          description="How to reach the student"
          icon={<Phone className="w-4 h-4" />}
        >
          <FormGrid columns={2}>
            <FormField
              label="Contact Number"
              icon={<Phone className="w-4 h-4" />}
              helper="Student’s active mobile number"
            >
              <Input
                id="contactNumber"
                name="contactInfo.contactNumber"
                value={formData.contactInfo.contactNumber}
                onChange={handleContactNumberChange}
                placeholder="Contact Number"
                className="h-11"
              />
            </FormField>
            <FormField
              label="School Email"
              icon={<Mail className="w-4 h-4" />}
              helper="Official school-provided email"
            >
              <Input
                id="schoolEmail"
                name="contactInfo.schoolEmail"
                value={formData.contactInfo.schoolEmail}
                onChange={handleChange}
                placeholder="School Email"
                className="h-11"
              />
            </FormField>
            <FormField
              label="Guardian Name"
              icon={<User className="w-4 h-4" />}
              helper="Name of parent or guardian"
            >
              <Input
                id="guardianName"
                name="contactInfo.guardianName"
                value={formData.contactInfo.guardianName}
                onChange={handleChange}
                placeholder="Guardian Name"
                className="h-11"
              />
            </FormField>
            <FormField
              label="Guardian Contact Number"
              icon={<Phone className="w-4 h-4" />}
              helper="Mobile number of the guardian"
            >
              <Input
                id="guardianContactNumber"
                name="contactInfo.guardianContactNumber"
                value={formData.contactInfo.guardianContactNumber}
                onChange={handleChange}
                placeholder="Guardian Contact Number"
                className="h-11"
              />
            </FormField>
          </FormGrid>
        </FormSection>
      ),
    },
    {
      value: 'address',
      label: 'Address',
      icon: MapPin,
      content: (
        <FormSection
          title="Address Information"
          description="Student's residential details"
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
      ),
    },
    {
      value: 'academic',
      label: 'Academic',
      icon: GraduationCap,
      content: (
        <FormSection
          title="Academic Information"
          description="Course and education level details"
          icon={<GraduationCap className="w-4 h-4" />}
        >
          <FormGrid columns={2}>
            <FormField
              label="Education Level"
              icon={<GraduationCap className="w-4 h-4" />}
              helper="Current educational standing"
              required
            >
              <Select
                value={formData.academicInfo.educationLevel}
                onValueChange={(value) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    academicInfo: {
                      ...prev.academicInfo,
                      educationLevel: value as EducationLevel,
                    },
                  }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EducationLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              label="Section"
              icon={<FileText className="w-4 h-4" />}
              helper="Class or section assigned"
            >
              <Input
                id="section"
                name="academicInfo.section"
                value={formData.academicInfo.section}
                onChange={handleChange}
                placeholder="Section"
                className="h-11"
              />
            </FormField>
            <FormField
              label="Grade Level"
              icon={<Hash className="w-4 h-4" />}
              helper="Grade level or year applicable"
            >
              <Input
                id="gradeLevel"
                name="academicInfo.gradeLevel"
                value={formData.academicInfo.gradeLevel}
                onChange={handleChange}
                placeholder="Grade Level"
                className="h-11"
              />
            </FormField>
            <FormField
              label="Year Level"
              icon={<Calendar className="w-4 h-4" />}
              helper="Year level in curriculum"
            >
              <Input
                id="yearLevel"
                name="academicInfo.yearLevel"
                value={formData.academicInfo.yearLevel}
                onChange={handleChange}
                placeholder="Year Level"
                className="h-11"
              />
            </FormField>
            <FormField
              label="Course"
              icon={<Package className="w-4 h-4" />}
              helper="Course"
            >
              {/* <Input
                id="courseId"
                name="academicInfo.courseId"
                value={formData.academicInfo.courseId}
                onChange={handleChange}
                placeholder="Course ID"
                className="h-11"
              /> */}
              <CoursePicker
                value={formData.academicInfo.course}
                onSelect={(course) =>
                  setFormData((prev) => ({
                    ...prev,
                    academicInfo: {
                      ...prev.academicInfo,
                      course,
                    },
                  }))
                }
              />
            </FormField>
            {/* <FormField
              label="Strand ID"
              icon={<Package className="w-4 h-4" />}
              helper="Senior high school strand ID"
            >
              <Input
                id="strandId"
                name="academicInfo.strandId"
                value={formData.academicInfo.strandId}
                onChange={handleChange}
                placeholder="Strand ID"
                className="h-11"
              />
            </FormField> */}
          </FormGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <FormTab
      tabs={formTabs}
      defaultValue="personal"
      onTabChange={(value) => console.log('Tab changed to:', value)}
    />
  );
}
