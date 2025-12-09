// src/(private)/employee/[employeeId]/tabs/education-info-tab.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Award } from 'lucide-react';
import { EmployeeEducationalInfo } from '@/api/protected/employee-api/employee.interface';
import { InfoField } from '../components/info-field';

interface EducationInfoTabProps {
  educationalInfo?: EmployeeEducationalInfo | null;
}

function EducationSection({
  title,
  level,
  schoolName,
  yearGraduated,
  course,
}: {
  title: string;
  level?: string | null;
  schoolName?: string | null;
  yearGraduated?: string | null;
  course?: string | null;
}) {
  const hasData = level || schoolName || yearGraduated || course;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5" />
        {title}
      </h3>
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {level && <InfoField label="Level" value={level} />}
          {schoolName && <InfoField label="School Name" value={schoolName} />}
          {yearGraduated && (
            <InfoField label="Year Graduated" value={yearGraduated} />
          )}
          {course && <InfoField label="Course" value={course} />}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No information available
        </p>
      )}
    </div>
  );
}

export default function EducationInfoTab({
  educationalInfo,
}: EducationInfoTabProps) {
  if (!educationalInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Educational Background
          </CardTitle>
          <CardDescription>
            No educational information available
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Educational Background
        </CardTitle>
        <CardDescription>
          Academic qualifications and achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EducationSection
          title="Elementary"
          level={educationalInfo.elementary}
          schoolName={educationalInfo.elementarySchoolName}
          yearGraduated={educationalInfo.elementaryYearGraduated}
        />

        <Separator />

        <EducationSection
          title="High School"
          level={educationalInfo.highSchool}
          schoolName={educationalInfo.highSchoolName}
          yearGraduated={educationalInfo.highSchoolYearGraduated}
        />

        <Separator />

        <EducationSection
          title="College"
          level={educationalInfo.college}
          schoolName={educationalInfo.collegeSchoolName}
          yearGraduated={educationalInfo.collegeYearGraduated}
          course={educationalInfo.collegeCourse}
        />

        <Separator />

        <EducationSection
          title="Master's Degree"
          level={educationalInfo.masters}
          schoolName={educationalInfo.mastersSchoolName}
          yearGraduated={educationalInfo.mastersYearGraduated}
          course={educationalInfo.mastersCourse}
        />

        <Separator />

        <EducationSection
          title="Doctorate (PhD)"
          level={educationalInfo.phd}
          schoolName={educationalInfo.phdSchoolName}
          yearGraduated={educationalInfo.phdYearGraduated}
          course={educationalInfo.phdCourse}
        />
      </CardContent>
    </Card>
  );
}
