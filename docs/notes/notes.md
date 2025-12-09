# Core Work Relation Info

```ts
export interface EmployeeWorkRelationCore {
  id?: string | null;
  employeeId: string;
  position: string;
  department?: string | null;
  employmentType?: EmploymentTypeEnum;
  employmentStatus?: EmploymentStatusEnum;
  dateHired: string;
  dateRegularized?: string | null;
  contractEndDate?: string | null;
  probationPeriodEnd?: string | null;
  supervisorId?: string | null;
  workLocation?: string | null;
  workSchedule?: string | null;
  dailyHours?: number | null; // e.g., 8
  weeklyHours?: number | null; // e.g., 48 max per Labor Code
  isProjectBased?: boolean | null; // Seasonal / project-based employment
}
```

# Payroll & Compensation

```ts
export interface EmployeePayrollInfo {
  salary?: number | null;
  payFrequency?: PayFrequencyEnum;
  currency?: string | null;
  allowances?: Allowance[] | null;
  governmentDeductions?: GovernmentDeductions | null;
  overtimeHours?: number | null;
  overtimeRate?: number | null;
  nightDifferentialHours?: number | null;
  nightDifferentialRate?: number | null;
  holidayPay?: number | null;
  thirteenthMonthPay?: number | null; // Mandatory under DOLE
}

export interface Allowance {
  type: string; // e.g., Transport, Meal, Housing
  amount: number;
  currency?: string | null;
}

export interface GovernmentDeductions {
  sss?: number | null;
  philHealth?: number | null;
  pagIbig?: number | null;
  withholdingTax?: number | null;
}
```

# Employee Benefits

```ts
export interface EmployeeBenefits {
  healthInsurance?: string | null;
  lifeInsurance?: string | null;
  retirementPlan?: string | null;
  otherBenefits?: string[] | null;
  leaveCredits?: LeaveCredits | null; // DOLE-mandated leaves
}

export interface LeaveCredits {
  vacationLeave?: number | null; // e.g., 5 days
  sickLeave?: number | null; // e.g., 5 days
  emergencyLeave?: number | null; // optional
}
```

# Employment History (Promotions / Transfers)

```ts
export interface EmploymentHistory {
  id?: string | null;
  position?: string | null;
  department?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  salary?: number | null;
  supervisorId?: string | null;
  notes?: string | null; // Promotions, transfers, role changes
}
```

# Enums

```ts
export enum EmploymentTypeEnum {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  CONTRACT = "Contract",
  PROBATION = "Probation",
  INTERN = "Intern",
}

export enum EmploymentStatusEnum {
  ONBOARDING = "Onboarding",
  ACTIVE = "Active",
  PROBATION = "Probation",
  TERMINATED = "Terminated",
}

export enum PayFrequencyEnum {
  MONTHLY = "Monthly",
  SEMI_MONTHLY = "Semi-Monthly",
  WEEKLY = "Weekly",
  DAILY = "Daily",
}
```
