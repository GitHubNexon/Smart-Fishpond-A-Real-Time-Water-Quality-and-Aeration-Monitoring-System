export enum GenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum CivilStatusEnum {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed',
  SEPERATED = 'Seperated',
}

export enum BloodTypeEnum {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum EmploymentTypeEnum {
  REGULAR = 'Regular',
  PART_TIME = 'Part-Time',
  CONTRACT = 'Contract',
  PROBATION = 'Probation',
  INTERN = 'Intern',
  PROJECT_BASED = 'Project-Based',
}
//Active -> Terminated
export enum EmploymentStatusEnum {
  ACTIVE = 'Active', // Currently employed and working
  RESIGNED = 'Resigned', // Employee voluntarily left (Contract or Regular)
  RETIRED = 'Retired', // Employee retired (Regular only)
  TERMINATED = 'Terminated', // Company terminated the employee
}

export enum PayFrequencyEnum {
  MONTHLY = 'Monthly',
  SEMI_MONTHLY = 'Semi-Monthly',
  WEEKLY = 'Weekly',
  DAILY = 'Daily',
}

export enum WorkScheduleEnum {
  DAY = 'Day',
  NIGHT = 'Night',
  GRAVEYARD = 'Graveyard', // Optional, common for 24-hour operations
  FLEXIBLE = 'Flexible', // Flexible / hybrid schedule
  ROTATING = 'Rotating', // Rotating shifts
}
