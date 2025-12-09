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
import {
  User,
  MapPin,
  Calendar,
  Eye,
  Syringe,
  Ruler,
  Weight,
} from 'lucide-react';
import {
  GenderEnum,
  BloodTypeEnum,
  CivilStatusEnum,
} from '@/api/protected/employee-api/enums/employee.enum';
import { Citizenship } from './citizenship.data';
import EmployeeIdGenerator from './employee_id_generator';

interface PersonalInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function PersonalInfoForm({
  formData,
  handleChange,
  handleSelectChange,
  setFormData,
}: PersonalInfoFormProps) {
  return (
    <FormSection
      title="Personal Information"
      description="Basic details about the Employee"
      icon={<User className="w-4 h-4" />}
    >
      <FormGrid columns={3}>
        <FormField
          label="Employee ID"
          required
          icon={<User className="w-4 h-4" />}
          helper="Employee Company ID"
        >
          <Input
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="e.g EMP-2025-0001"
            className="h-11"
            required
          />
        </FormField>
        <FormField
          label="First Name"
          required
          icon={<User className="w-4 h-4" />}
          helper="Employee given first name"
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
          helper="Employee surname"
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
          label="Suffix"
          icon={<User className="w-4 h-4" />}
          helper="Optional suffix (Jr., Sr., III, etc.)"
        >
          <Select
            value={formData.personalInfo.suffix ?? undefined}
            onValueChange={(value) => {
              handleSelectChange(
                'personalInfo.suffix',
                value === 'none' ? '' : value,
              );
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select suffix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {['Jr.', 'Sr.', 'III', 'IV'].map((suffix) => (
                <SelectItem key={suffix} value={suffix}>
                  {suffix}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                personalInfo: { ...prev.personalInfo, birthDate: val },
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

        <FormField
          label="Civil Status"
          required
          icon={<User className="w-4 h-4" />}
          helper="Select employee civil status"
        >
          <Select
            value={formData.personalInfo.civilStatus ?? undefined}
            onValueChange={(value) =>
              handleSelectChange('personalInfo.civilStatus', value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select civil status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CivilStatusEnum).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Blood Type"
          icon={<Syringe className="w-4 h-4" />}
          helper="Select Blood Type"
        >
          <Select
            value={formData.personalInfo.bloodType}
            onValueChange={(value) =>
              handleSelectChange('personalInfo.bloodType', value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(BloodTypeEnum).map((bloodType) => (
                <SelectItem key={bloodType} value={bloodType}>
                  {bloodType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Height"
          required
          icon={<Ruler className="w-4 h-4" />}
          helper="Employee height"
        >
          <Input
            id="height"
            name="personalInfo.height"
            value={formData.personalInfo.height}
            onChange={handleChange}
            placeholder="Height"
            className="h-11"
            type="number"
            min={0}
            step={0.1}
          />
        </FormField>

        <FormField
          label="Weight"
          required
          icon={<Weight className="w-4 h-4" />}
          helper="Employee weight"
        >
          <Input
            id="weight"
            name="personalInfo.weight"
            value={formData.personalInfo.weight}
            onChange={handleChange}
            className="h-11"
            type="number"
            min={0}
            step={0.1}
          />
        </FormField>

        <FormField
          label="Citizenship"
          required
          icon={<MapPin className="w-4 h-4" />}
          helper="Select employee nationality"
        >
          <Select
            value={formData.personalInfo.citizenship}
            onValueChange={(value) =>
              handleSelectChange('personalInfo.citizenship', value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select citizenship" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              <SelectItem value="N/A">N/A</SelectItem>
              {Citizenship.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </FormGrid>
    </FormSection>
  );
}
