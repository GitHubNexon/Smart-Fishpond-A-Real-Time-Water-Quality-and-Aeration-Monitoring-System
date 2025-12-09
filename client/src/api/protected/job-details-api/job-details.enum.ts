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

export enum TerminationReasonEnum {
    FOR_CAUSE = 'for_cause',
    WITHOUT_CAUSE = 'without_cause'
}