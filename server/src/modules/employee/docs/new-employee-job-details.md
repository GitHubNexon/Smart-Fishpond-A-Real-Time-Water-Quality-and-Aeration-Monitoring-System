# Employee Job Details - Employment Lifecycle Documentation

## Overview

This document outlines the employment lifecycle management system, including employment types, statuses, validation rules, and transition workflows for employee job details.

---

## Employment Enums

### Employment Types

```typescript
export enum EmploymentTypeEnum {
  REGULAR = 'Regular',           // Permanent, full-time employees
  PART_TIME = 'Part-Time',       // Part-time employees
  CONTRACT = 'Contract',         // Fixed-term contract employees
  PROBATION = 'Probation',       // Employees under probationary period
  INTERN = 'Intern',             // Interns
  PROJECT_BASED = 'Project-Based' // Project-based employees
}
```

### Employment Status

```typescript
export enum EmploymentStatusEnum {
  ACTIVE = 'Active',           // Currently employed and working
  RESIGNED = 'Resigned',       // Employee voluntarily left (Contract or Regular)
  RETIRED = 'Retired',         // Employee retired (Regular only)
  TERMINATED = 'Terminated'    // Company terminated the employee
}
```

### Termination Reason (for TERMINATED status only)

```typescript
type TerminationReason = 'for_cause' | 'without_cause';
```

**Status Descriptions:**

- **ACTIVE**: Employee is currently working
- **RESIGNED**: Employee voluntarily left their position
  - ✅ Allowed for: Regular, Contract
  - ❌ Not allowed for: Probation, Part-Time, Intern, Project-Based (use TERMINATED)
  - 📅 **Required fields:** `resignedDate`, `resignationReason` (optional), `resignationNotes` (optional)
- **RETIRED**: Employee retired from the company
  - ✅ Allowed for: Regular only
  - ❌ Not allowed for: All other types
  - 📅 **Required fields:** `retiredDate`, `retirementNotes` (optional)
- **TERMINATED**: Company ended the employment
  - ✅ Allowed for: All employment types
  - 📅 **Required fields:** `terminatedDate`, `terminationReason` ('for_cause' or 'without_cause')
  - 📝 **Optional fields:** `terminationNotes`
  - 🔄 **Re-hire eligible:** Only TERMINATED employees can be re-hired (optional)
  - **Termination Types:**
    - `for_cause`: Employee fired for misconduct, poor performance, policy violation (can be re-hired but may need approval)
    - `without_cause`: Layoff, position eliminated, restructuring (freely re-hireable)

---

## Employment Lifecycle Flows

### 1. Standard Onboarding Flow

```
Probation → Regular (Regularization)
    ↓
Probation → Contract (Fixed-term)
```

### 2. Alternative Hiring Flows

```
Part-Time (Direct hire, no progression)
Intern (Direct hire, no progression)
Project-Based (Direct hire, no progression)
```

### 3. Exit Flows

```
ACTIVE → RESIGNED (voluntary, requires resignedDate)
ACTIVE → RETIRED (Regular only, requires retiredDate)
ACTIVE → TERMINATED (company decision, requires terminatedDate + terminationReason)
         ├── for_cause (fired/misconduct)
         └── without_cause (layoff/restructuring)
```

### 4. Re-hire Flow

```
TERMINATED (for_cause or without_cause) → ACTIVE (Optional re-hire, follows first-time employment rules)
RESIGNED → ❌ Cannot be re-hired
RETIRED → ❌ Cannot be re-hired
```

---

## Employment Type Details

### 🔵 Probation

**Purpose:** Trial period for new hires before regularization or contract assignment.

**Duration:** Typically 1-6 months

**Required Fields:**
- `dateHired` (required)
- `probationPeriodEnd` (required)

**Exit Options:**
- `TERMINATED` (requires `terminatedDate` + `terminationReason`)

**Transition Rules:**
- ✅ Can transition to `Regular` or `Contract` after probation period ends
- ❌ Cannot add new job details during probation period
- ❌ Cannot transition to `Part-Time`, `Intern`, or `Project-Based`
- ❌ Cannot RESIGN or RETIRE from Probation (use TERMINATED)

**Example - Active:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Probation",
  "employmentStatus": "Active",
  "dateHired": "2025-11-27",
  "probationPeriodEnd": "2026-05-27"
}
```

**Example - Termination (For Cause):**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Probation",
  "employmentStatus": "Terminated",
  "terminatedDate": "2025-12-15",
  "terminationReason": "for_cause",
  "terminationNotes": "Failed to meet probation requirements. Multiple absences and performance issues."
}
```

**Example - Termination (Without Cause):**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Probation",
  "employmentStatus": "Terminated",
  "terminatedDate": "2025-12-15",
  "terminationReason": "without_cause",
  "terminationNotes": "Position eliminated due to budget constraints. Employee eligible for re-hire."
}
```

---

### 🟢 Regular

**Purpose:** Permanent, full-time employees with indefinite employment.

**Required Fields:**
- `dateRegularized` (required)

**Exit Options:**
1. **RESIGNED** - Employee voluntarily leaves (requires `resignedDate`)
2. **RETIRED** - Employee retires (requires `retiredDate`, only for Regular)
3. **TERMINATED** - Company ends employment (requires `terminatedDate` + `terminationReason`)

**Transition Rules:**
- ✅ Can resign (employee chooses to leave)
- ✅ Can retire (for retirement only)
- ✅ Can be terminated (company decision)
- ❌ Cannot transition to other employment types
- ✅ Can continue with updated job details as `Regular`

**Example - Regularization:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Active",
  "dateRegularized": "2026-04-27"
}
```

**Example - Resignation:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Resigned",
  "resignedDate": "2027-05-15",
  "resignationReason": "Better opportunity",
  "resignationNotes": "Accepted position at another company with higher compensation and career growth opportunities."
}
```

**Example - Retirement:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Retired",
  "retiredDate": "2030-12-31",
  "retirementNotes": "Employee retired after 25 years of service. Eligible for full pension benefits."
}
```

**Example - Termination (For Cause):**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Terminated",
  "terminatedDate": "2027-03-20",
  "terminationReason": "for_cause",
  "terminationNotes": "Terminated for violation of company policy: unauthorized disclosure of confidential information and repeated misconduct after written warnings."
}
```

**Example - Termination (Without Cause):**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Terminated",
  "terminatedDate": "2027-03-20",
  "terminationReason": "without_cause",
  "terminationNotes": "Position eliminated due to company restructuring and downsizing. Employee eligible for re-hire and severance package."
}
```

---

### 🟡 Contract

**Purpose:** Fixed-term employment with defined start and end dates. **Supports contract renewal.**

**Required Fields:**
- `contractStartDate` (required)
- `contractEndDate` (required)

**Exit Options:**
1. **RESIGNED** - Employee voluntarily leaves during active contract (requires `resignedDate`)
2. **TERMINATED** - Company ends contract after it ends (requires `terminatedDate` + `terminationReason`)

**Validation Rules:**
- Contract start date must be after probation end date (if coming from probation)
- Contract end date must be after start date
- Contract start date should typically be after probation period ends
- **Contract periods cannot overlap**
- **Cannot have duplicate contract dates**

**Transition Rules:**
- ✅ Can renew contract with new start and end dates (multiple contracts allowed)
- ✅ Can resign during active contract (requires `resignedDate`)
- ✅ Can be terminated after contract ends (requires `terminatedDate` + `terminationReason`)
- ❌ Cannot extend or modify during active contract period (create renewal instead)
- ❌ Cannot retire (use RESIGNED or TERMINATED)

**Example - Initial Contract:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Active",
  "contractStartDate": "2026-01-04",
  "contractEndDate": "2026-03-04"
}
```

**Example - Contract Renewal:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Active",
  "contractStartDate": "2026-03-05",
  "contractEndDate": "2026-09-05"
}
```

**Example - Resignation:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Resigned",
  "resignedDate": "2026-08-15",
  "resignationReason": "Found permanent position",
  "resignationNotes": "Employee found a permanent position elsewhere and chose to end contract early."
}
```

**Example - Termination (Without Cause):**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Terminated",
  "terminatedDate": "2026-09-06",
  "terminationReason": "without_cause",
  "terminationNotes": "Contract ended as scheduled. No renewal offered due to project completion."
}
```

---

### 🟠 Part-Time

**Purpose:** Employees working reduced hours (not full-time).

**Required Fields:**
- `dateHired` (required)

**Exit Options:**
- `TERMINATED` (requires `terminatedDate` + `terminationReason`)

**Transition Rules:**
- ❌ Cannot transition to other employment types
- ✅ Can only be terminated
- ❌ Cannot RESIGN or RETIRE (use TERMINATED)
- 🔄 Re-hiring after termination is optional (company decision)

**Example - Active:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Support",
  "department": "IT Department",
  "employmentType": "Part-Time",
  "employmentStatus": "Active",
  "dateHired": "2025-11-27"
}
```

**Example - Termination:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Support",
  "department": "IT Department",
  "employmentType": "Part-Time",
  "employmentStatus": "Terminated",
  "terminatedDate": "2026-05-20",
  "terminationReason": "without_cause",
  "terminationNotes": "Part-time position no longer needed. Employee eligible for re-hire."
}
```

---

### 🔴 Intern

**Purpose:** Students or trainees gaining work experience.

**Required Fields:**
- `dateHired` (required)

**Exit Options:**
- `TERMINATED` (requires `terminatedDate` + `terminationReason`)

**Transition Rules:**
- ❌ Cannot transition to other employment types
- ✅ Can only be terminated
- ❌ Cannot RESIGN or RETIRE (use TERMINATED)
- 🔄 Re-hiring after termination is optional (company decision)

**Example - Active:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Intern",
  "department": "IT Department",
  "employmentType": "Intern",
  "employmentStatus": "Active",
  "dateHired": "2025-11-27"
}
```

**Example - Termination:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Intern",
  "department": "IT Department",
  "employmentType": "Intern",
  "employmentStatus": "Terminated",
  "terminatedDate": "2026-02-28",
  "terminationReason": "without_cause",
  "terminationNotes": "Internship period completed successfully. Employee eligible for re-hire as permanent staff."
}
```

---

### 🟣 Project-Based

**Purpose:** Employees hired for specific projects or deliverables.

**Required Fields:**
- `dateHired` (required)

**Exit Options:**
- `TERMINATED` (requires `terminatedDate` + `terminationReason`)

**Transition Rules:**
- ❌ Cannot transition to other employment types
- ✅ Can only be terminated
- ❌ Cannot RESIGN or RETIRE (use TERMINATED)
- 🔄 Re-hiring after termination is optional (company decision)

**Example - Active:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Consultant",
  "department": "IT Department",
  "employmentType": "Project-Based",
  "employmentStatus": "Active",
  "dateHired": "2025-11-27"
}
```

**Example - Termination:**
```json
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Consultant",
  "department": "IT Department",
  "employmentType": "Project-Based",
  "employmentStatus": "Terminated",
  "terminatedDate": "2026-03-15",
  "terminationReason": "without_cause",
  "terminationNotes": "Project completed successfully. Employee eligible for future project-based work."
}
```

---

## Validation Rules Summary

### 🚫 Duplicate Prevention

**No Duplicate Active Records:**
- Each employee can only have **ONE active verified job detail** at a time
- Attempting to create duplicate entries will result in an error
- Multiple terminated records are allowed (for historical tracking)
- Unverified pending records must be verified or deleted before creating new ones

**No Duplicate Terminal Status Records:**
- Each employee can only have **ONE terminal status** (RESIGNED, RETIRED, TERMINATED) at a time
- Attempting to create duplicate terminal status records will result in an error
- This prevents double termination, resignation, or retirement

**Error Examples:**
```
Employee already has an active Probation job detail (ID: abc-123). 
Cannot create duplicate entries. Please update the existing record or terminate it first.
```

```
Employee has already been terminated (Record ID: xyz-789). 
Cannot create duplicate terminated records. 
If you want to re-hire this employee, the current status must be TERMINATED.
```

### 📅 Required Exit Fields

All exit statuses require corresponding fields:

- **RESIGNED** → requires `resignedDate` (required), `resignationReason` (optional), `resignationNotes` (optional)
- **TERMINATED** → requires `terminatedDate` (required), `terminationReason` (required: 'for_cause' or 'without_cause'), `terminationNotes` (optional)
- **RETIRED** → requires `retiredDate` (required), `retirementNotes` (optional)

**Validation Error Examples:**
```
resignedDate is required when employmentStatus is RESIGNED
```

```
terminatedDate and terminationReason are required when employmentStatus is TERMINATED
```

```
terminationReason is required when employmentStatus is TERMINATED. Must be either "for_cause" or "without_cause"
```

### 🔄 Re-hire Rules

**Only TERMINATED employees can be re-hired:**
- ✅ **TERMINATED (for_cause)** → Can be re-hired (may require special approval based on business rules)
- ✅ **TERMINATED (without_cause)** → Can be re-hired freely
- ❌ **RESIGNED** → Cannot be re-hired
- ❌ **RETIRED** → Cannot be re-hired

**Re-hire follows first-time employment rules:**
- Must start with Probation, Part-Time, Intern, or Project-Based
- Cannot directly re-hire as Regular or Contract

**Error Example:**
```
Employee has RESIGNED (2027-05-15). 
Resigned employees cannot be re-hired. Only TERMINATED employees can be re-hired.
```

### First-Time Employment
✅ **Allowed:** Probation, Part-Time, Intern, Project-Based  
❌ **Not Allowed:** Regular, Contract

*Employees must start with appropriate entry-level employment types.*

### Verified Job Details Only
⚠️ Validation only checks against **verified** job details (`isVerified: true`)

### Transition Matrix

| From \ To | Regular | Contract | Probation | Part-Time | Intern | Project-Based | Resigned | Retired | Terminated |
|-----------|---------|----------|-----------|-----------|--------|---------------|----------|---------|------------|
| **Probation** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Regular** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Contract** | ❌ | ✅ (renewal) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Part-Time** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Intern** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Project-Based** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Common Workflows

### Workflow 1: Standard Regularization

```
Step 1: Onboarding (Probation)
POST /api/job-details
{
  "employmentType": "Probation",
  "employmentStatus": "Active",
  "dateHired": "2025-11-27",
  "probationPeriodEnd": "2026-05-27"
}

Step 2: Regularization (after 6 months)
POST /api/job-details
{
  "employmentType": "Regular",
  "employmentStatus": "Active",
  "dateRegularized": "2026-05-28"
}

Step 3: Resignation (when employee leaves)
POST /api/job-details
{
  "employmentType": "Regular",
  "employmentStatus": "Resigned",
  "resignedDate": "2027-08-15",
  "resignationReason": "Career advancement",
  "resignationNotes": "Accepted leadership position at another company."
}
```

### Workflow 2: Termination FOR CAUSE and Re-hire

```
Step 1: Active Regular Employee
POST /api/job-details
{
  "employmentType": "Regular",
  "employmentStatus": "Active",
  "dateRegularized": "2020-01-15"
}

Step 2: Termination (For Cause)
POST /api/job-details
{
  "employmentType": "Regular",
  "employmentStatus": "Terminated",
  "terminatedDate": "2025-06-30",
  "terminationReason": "for_cause",
  "terminationNotes": "Terminated for repeated policy violations and poor performance after multiple warnings."
}

Step 3: Re-hire (optional, may need approval)
POST /api/job-details
{
  "employmentType": "Probation",
  "employmentStatus": "Active",
  "dateHired": "2026-01-15",
  "probationPeriodEnd": "2026-07-15"
}
```

### Workflow 3: Termination WITHOUT CAUSE and Re-hire

```
Step 1: Active Regular Employee
POST /api/job-details
{
  "employmentType": "Regular",
  "employmentStatus": "Active",
  "dateRegularized": "2020-01-15"
}

Step 2: Termination (Without Cause - Layoff)
POST /api/job-details
{
  "employmentType": "Regular",
  "employmentStatus": "Terminated",
  "terminatedDate": "2025-06-30",
  "terminationReason": "without_cause",
  "terminationNotes": "Position eliminated due to company restructuring. Employee eligible for re-hire and severance package."
}

Step 3: Re-hire (freely allowed)
POST /api/job-details
{
  "employmentType": "Probation",
  "employmentStatus": "Active",
  "dateHired": "2026-01-15",
  "probationPeriodEnd": "2026-07-15"
}
```

### Workflow 4: Contract Employment

```
Step 1: Onboarding (Probation)
POST /api/job-details
{
  "employmentType": "Probation",
  "employmentStatus": "Active",
  "dateHired": "2025-11-27",
  "probationPeriodEnd": "2025-12-27"
}

Step 2: Initial Contract
POST /api/job-details
{
  "employmentType": "Contract",
  "employmentStatus": "Active",
  "contractStartDate": "2026-01-04",
  "contractEndDate": "2026-07-04"
}

Step 3: Contract Termination
POST /api/job-details
{
  "employmentType": "Contract",
  "employmentStatus": "Terminated",
  "terminatedDate": "2026-07-05",
  "terminationReason": "without_cause",
  "terminationNotes": "Contract ended as scheduled. No renewal offered."
}
```

---

## Error Messages

### Common Validation Errors

**Missing Required Fields:**
```
terminatedDate and terminationReason are required when employmentStatus is TERMINATED
```

```
terminationReason is required when employmentStatus is TERMINATED. Must be either "for_cause" or "without_cause"
```

**Duplicate Terminal Status:**
```
Employee has already been terminated (Record ID: abc-123). 
Cannot create duplicate terminated records.
```

**Invalid Re-hire:**
```
Employee has RESIGNED (2027-05-15). 
Resigned employees cannot be re-hired. Only TERMINATED employees can be re-hired.
```

---

## Best Practices

1. **Always provide terminationReason** when terminating employees ('for_cause' or 'without_cause')
2. **Document termination details** in `terminationNotes` for audit trail
3. **Use 'for_cause'** for misconduct, policy violations, poor performance
4. **Use 'without_cause'** for layoffs, restructuring, position eliminations
5. **Only TERMINATED employees can be re-hired** (not RESIGNED or RETIRED)
6. **Track resignation reasons** for HR analytics and exit interviews
7. **Maintain detailed notes** for all exit scenarios

---

## Summary of Changes

### What's New:

1. ✅ **Added terminationReason field** - Required for TERMINATED status ('for_cause' or 'without_cause')
2. ✅ **Added terminationNotes field** - Optional detailed notes about termination
3. ✅ **Added resignationReason field** - Optional reason for resignation
4. ✅ **Added resignationNotes field** - Optional detailed notes about resignation
5. ✅ **Added retirementNotes field** - Optional notes about retirement
6. ✅ **Validator checks for terminationReason** - Ensures it's provided with TERMINATED status
7. ✅ **Re-hire logic considers terminationReason** - Both types can be re-hired (business rules may differ)

### Key Concepts:

- **TERMINATED (for_cause)** = Fired for misconduct/performance → Can be re-hired (may need approval)
- **TERMINATED (without_cause)** = Layoff/restructuring → Freely re-hireable
- **RESIGNED** = Employee left voluntarily → Cannot be re-hired
- **RETIRED** = Employee retired → Cannot be re-hired

---

**Last Updated:** November 27, 2025  
**Version:** 3.0.0  
**Changes:** Added termination reason tracking (for_cause vs without_cause) and exit detail fields