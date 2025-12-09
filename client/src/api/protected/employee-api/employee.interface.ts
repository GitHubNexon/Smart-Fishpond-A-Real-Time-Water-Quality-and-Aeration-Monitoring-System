import { UserData } from '@/interfaces/user-api.interface';
import {
  GenderEnum,
  CivilStatusEnum,
  BloodTypeEnum,
} from './enums/employee.enum';
import { JobDetailsData } from '../job-details-api/employee-job-details.interface';

export interface GetAllPaginatedEmployee {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  employee_data: EmployeeData[];
}

export interface EmployeePersonalInfo {
  id?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  birthDate: string;
  gender?: GenderEnum;
  civilStatus?: CivilStatusEnum;
  bloodType?: BloodTypeEnum;
  height?: number | 0;
  weight?: number | 0;
  citizenship?: string | null;
}

export interface EmployeeContactInfo {
  id?: string | null;
  contactNo?: string | null;
  contactEmail?: string | null;
  emergencyContactNo?: string | null;
  emergenecyContactName?: string | null;
  emergencyRelationship?: string | null;
}

export interface EmployeeAddressInfo {
  id?: string | null;
  zipCode?: string | null;
  street?: string | null;
  barangay?: string | null;
  city?: string | null;
  province?: string | null;
  region?: string | null;
}

export interface EmployeeGovernmentInfo {
  id?: string | null;
  sss?: string | null;
  pagIbig?: string | null;
  philHealth?: string | null;
  tin?: string | null;
  passportNo?: string | null;
  driversLicense?: string | null;
  postalId?: string | null;
  votersId?: string | null;
  nbi?: string | null;
  policeClearance?: string | null;
}

export interface EmployeeChildInfo {
  id?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  suffix?: string | null;
}

export interface EmployeeFamilyInfo {
  id?: string | null;
  spouseFirstName?: string | null;
  spouseMiddleName?: string | null;
  spouseLastName?: string | null;
  spouseSuffix?: string | null;
  fatherFirstName?: string | null;
  fatherMiddleName?: string | null;
  fatherLastName?: string | null;
  fatherSuffix?: string | null;
  motherFirstName?: string | null;
  motherMiddleName?: string | null;
  motherLastName?: string | null;
  motherMaidenName?: string | null;
  children?: EmployeeChildInfo[];
}

export interface EmployeeEducationalInfo {
  id?: string | null;

  elementary?: string | null;
  elementarySchoolName?: string | null;
  elementaryYearGraduated?: string | null;

  highSchool?: string | null;
  highSchoolName?: string | null;
  highSchoolYearGraduated?: string | null;

  college?: string | null;
  collegeSchoolName?: string | null;
  collegeYearGraduated?: string | null;
  collegeCourse?: string | null;

  masters?: string | null;
  mastersSchoolName?: string | null;
  mastersYearGraduated?: string | null;
  mastersCourse?: string | null;

  phd?: string | null;
  phdSchoolName?: string | null;
  phdYearGraduated?: string | null;
  phdCourse?: string | null;
}

export interface EmployeeWorkExperienceInfo {
  id?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  companyName?: string | null;
  position?: string | null;
  employmentType?: string | null;
  salary?: number | null;
}

export interface EmployeeData {
  id?: string | null;
  employeeId: string;
  personalInfo?: EmployeePersonalInfo | null;
  contactInfo?: EmployeeContactInfo | null;
  addressInfo?: EmployeeAddressInfo | null;
  governmentInfo?: EmployeeGovernmentInfo | null;
  familyInfo?: EmployeeFamilyInfo | null;
  educationalInfo?: EmployeeEducationalInfo | null;
  workExperienceInfo?: EmployeeWorkExperienceInfo[];
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  version?: number | null;
  isVerified?: boolean;
  isApproved?: boolean;
  verifiedAt?: string | null;
  approvedAt?: string | null;
  user?: UserData | null;
  preparedBy?: UserData | null;
  verifiedBy?: UserData | null;
  verifiapprovedByedBy?: UserData | null;
  coreWorkInfo?: JobDetailsData[];
}

export interface EmployeeRequest {
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


export interface EmployeeResponse {
  status: string;
  message: string;
  data: EmployeeData | null;
}
