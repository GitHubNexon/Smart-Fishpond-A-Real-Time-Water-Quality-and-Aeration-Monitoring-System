'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { School, GraduationCap, Book } from 'lucide-react';

interface EducationInfoFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function EducationInfoForm({
  formData,
  handleChange,
}: EducationInfoFormProps) {
  return (
    <>
      {/* ELEMENTARY */}
      <FormSection
        title="Elementary Education"
        description="Basic elementary school information"
        icon={<School className="w-4 h-4" />}
        className="mb-5"
      >
        <FormGrid columns={3}>
          <FormField
            label="Level / Status"
            icon={<School className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.elementary"
              value={formData.educationalInfo.elementary}
              onChange={handleChange}
              placeholder="Completed / Undergraduate"
              className="h-11"
            />
          </FormField>

          <FormField label="School Name" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.elementarySchoolName"
              value={formData.educationalInfo.elementarySchoolName}
              onChange={handleChange}
              placeholder="Elementary School"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Year Graduated"
            icon={<GraduationCap className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.elementaryYearGraduated"
              value={formData.educationalInfo.elementaryYearGraduated}
              onChange={handleChange}
              placeholder="YYYY"
              type="number"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* HIGH SCHOOL */}
      <FormSection
        title="High School Education"
        description="Junior / Senior high school details"
        icon={<School className="w-4 h-4" />}
        className="mb-5"
      >
        <FormGrid columns={3}>
          <FormField
            label="Level / Status"
            icon={<School className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.highSchool"
              value={formData.educationalInfo.highSchool}
              onChange={handleChange}
              placeholder="Completed / Undergraduate"
              className="h-11"
            />
          </FormField>

          <FormField label="School Name" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.highSchoolName"
              value={formData.educationalInfo.highSchoolName}
              onChange={handleChange}
              placeholder="High School"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Year Graduated"
            icon={<GraduationCap className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.highSchoolYearGraduated"
              value={formData.educationalInfo.highSchoolYearGraduated}
              onChange={handleChange}
              placeholder="YYYY"
              type="number"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* COLLEGE */}
      <FormSection
        title="College Education"
        description="College / undergraduate academic background"
        icon={<School className="w-4 h-4" />}
        className="mb-5"
      >
        <FormGrid columns={3}>
          <FormField
            label="Level / Status"
            icon={<School className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.college"
              value={formData.educationalInfo.college}
              onChange={handleChange}
              placeholder="Completed / Undergraduate"
              className="h-11"
            />
          </FormField>

          <FormField label="School Name" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.collegeSchoolName"
              value={formData.educationalInfo.collegeSchoolName}
              onChange={handleChange}
              placeholder="College / University"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Year Graduated"
            icon={<GraduationCap className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.collegeYearGraduated"
              value={formData.educationalInfo.collegeYearGraduated}
              onChange={handleChange}
              placeholder="YYYY"
              type="number"
              className="h-11"
            />
          </FormField>

          <FormField label="Course" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.collegeCourse"
              value={formData.educationalInfo.collegeCourse}
              onChange={handleChange}
              placeholder="Program / Course"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* MASTERS */}
      <FormSection
        title="Master’s Degree"
        description="Postgraduate Master’s program details"
        icon={<GraduationCap className="w-4 h-4" />}
        className="mb-5"
      >
        <FormGrid columns={3}>
          <FormField
            label="Level / Status"
            icon={<School className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.masters"
              value={formData.educationalInfo.masters}
              onChange={handleChange}
              placeholder="Completed / Ongoing"
              className="h-11"
            />
          </FormField>

          <FormField label="School Name" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.mastersSchoolName"
              value={formData.educationalInfo.mastersSchoolName}
              onChange={handleChange}
              placeholder="Graduate School"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Year Graduated"
            icon={<GraduationCap className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.mastersYearGraduated"
              value={formData.educationalInfo.mastersYearGraduated}
              onChange={handleChange}
              placeholder="YYYY"
              type="number"
              className="h-11"
            />
          </FormField>

          <FormField label="Course / Major" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.mastersCourse"
              value={formData.educationalInfo.mastersCourse}
              onChange={handleChange}
              placeholder="Master's Program"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* PHD */}
      <FormSection
        title="Doctoral (PhD) Education"
        description="Doctorate academic background details"
        icon={<GraduationCap className="w-4 h-4" />}
      >
        <FormGrid columns={3}>
          <FormField
            label="Level / Status"
            icon={<School className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.phd"
              value={formData.educationalInfo.phd}
              onChange={handleChange}
              placeholder="Completed / Ongoing"
              className="h-11"
            />
          </FormField>

          <FormField label="School Name" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.phdSchoolName"
              value={formData.educationalInfo.phdSchoolName}
              onChange={handleChange}
              placeholder="University / Graduate School"
              className="h-11"
            />
          </FormField>

          <FormField
            label="Year Graduated"
            icon={<GraduationCap className="w-4 h-4" />}
          >
            <Input
              name="educationalInfo.phdYearGraduated"
              value={formData.educationalInfo.phdYearGraduated}
              onChange={handleChange}
              placeholder="YYYY"
              type="number"
              className="h-11"
            />
          </FormField>

          <FormField label="Course / Major" icon={<Book className="w-4 h-4" />}>
            <Input
              name="educationalInfo.phdCourse"
              value={formData.educationalInfo.phdCourse}
              onChange={handleChange}
              placeholder="Doctoral Program"
              className="h-11"
            />
          </FormField>
        </FormGrid>
      </FormSection>
    </>
  );
}
