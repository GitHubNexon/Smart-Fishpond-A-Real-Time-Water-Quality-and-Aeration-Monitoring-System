import {
  EmployeePersonalInfo,
  EmployeeAddressInfo,
  EmployeeChildInfo,
  EmployeeContactInfo,
  EmployeeFamilyInfo,
  EmployeeEducationalInfo,
  EmployeeGovernmentInfo,
  EmployeeWorkExperienceInfo,
} from '@/api/protected/employee-api/employee.interface';

export interface EmployeePayload {
  id?: string | null;
  employeeId: string;
  personalInfo?: EmployeePersonalInfo | null;
  contactInfo?: EmployeeContactInfo | null;
  addressInfo?: EmployeeAddressInfo | null;
  governmentInfo?: EmployeeGovernmentInfo | null;
  familyInfo?: EmployeeFamilyInfo | null;
  educationalInfo?: EmployeeEducationalInfo | null;
  workExperienceInfo?: EmployeeWorkExperienceInfo[];
}

export interface EmployeeFormData {
  id?: string | null;
  employeeId: string;
  personalInfo?: EmployeePersonalInfo | null;
  contactInfo?: EmployeeContactInfo | null;
  addressInfo?: EmployeeAddressInfo | null;
  governmentInfo?: EmployeeGovernmentInfo | null;
  familyInfo?: EmployeeFamilyInfo | null;
  educationalInfo?: EmployeeEducationalInfo | null;
  workExperienceInfo?: EmployeeWorkExperienceInfo[];
}
