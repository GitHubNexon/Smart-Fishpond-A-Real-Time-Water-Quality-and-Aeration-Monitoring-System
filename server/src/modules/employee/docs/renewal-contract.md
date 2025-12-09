# Contract Renewal & Employment Status - Implementation Summary

## New Features Added

### 1. ✅ Contract Renewal (Multiple Contracts)
Employees can now have **multiple contract entries** with different contract periods.

### 2. ✅ New Employment Statuses
Added three new statuses for better employment tracking:
- **RESIGNED** - Employee voluntarily leaves
- **RETIRED** - Employee retires (Regular only)
- **TERMINATED** - Company ends employment

---

## Employment Status Changes

### Old Enum
```typescript
export enum EmploymentStatusEnum {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
}
```

### New Enum
```typescript
export enum EmploymentStatusEnum {
  ACTIVE = 'Active',           // Currently employed
  RESIGNED = 'Resigned',       // Employee left voluntarily
  RETIRED = 'Retired',         // Employee retired (Regular only)
  TERMINATED = 'Terminated',   // Company terminated
}
```

---

## Contract Renewal Rules

### ✅ Allowed
- Multiple contracts with **different date ranges**
- Contract start date can be on or after previous contract end date
- Contracts can be back-to-back: `End: 2026-07-04` → `Start: 2026-07-05`

### ❌ Not Allowed
- **Overlapping contract periods**
- **Duplicate contract dates** (same start and end dates)
- Contract start date before current contract end date

### Example: Valid Contract Renewals

**Contract 1:**
```json
{
  "employmentType": "Contract",
  "contractStartDate": "2026-01-04",
  "contractEndDate": "2026-07-04"
}
```

**Contract 2 (Renewal):**
```json
{
  "employmentType": "Contract",
  "contractStartDate": "2026-07-05",  // ✅ After previous end
  "contractEndDate": "2027-01-05"
}
```

**Contract 3 (Another Renewal):**
```json
{
  "employmentType": "Contract",
  "contractStartDate": "2027-01-06",  // ✅ After previous end
  "contractEndDate": "2027-07-06"
}
```

### Example: Invalid Contract Renewals

**Overlapping:**
```json
// Contract 1: 2026-01-04 to 2026-07-04
// Contract 2: 2026-06-01 to 2026-12-01  ❌ Overlaps!
```

**Duplicate:**
```json
// Contract 1: 2026-01-04 to 2026-07-04
// Contract 2: 2026-01-04 to 2026-07-04  ❌ Same dates!
```

**Too Early:**
```json
// Contract 1: 2026-07-04 to 2027-01-04
// Contract 2: 2026-06-01 to 2026-12-01  ❌ Starts before current ends!
```

---

## Status Usage Rules

### RESIGNED

**Allowed For:**
- ✅ Regular employees
- ✅ Contract employees (during active contract)

**Not Allowed For:**
- ❌ Probation, Part-Time, Intern, Project-Based (use TERMINATED)

**Example:**
```json
{
  "employmentType": "Contract",
  "employmentStatus": "Resigned"
}
```

---

### RETIRED

**Allowed For:**
- ✅ Regular employees ONLY

**Not Allowed For:**
- ❌ All other employment types

**Example:**
```json
{
  "employmentType": "Regular",
  "employmentStatus": "Retired"
}
```

**Error if used with Contract:**
```
RETIRED status is only for Regular employees. 
Contract employees should use RESIGNED or TERMINATED.
```

---

### TERMINATED

**Allowed For:**
- ✅ ALL employment types
- ✅ Company-initiated termination

**Example:**
```json
{
  "employmentType": "Part-Time",
  "employmentStatus": "Terminated"
}
```

---

## Validation Logic Added

### 1. Overlapping Contract Check

```typescript
private async checkForOverlappingContracts(
  employeeId: string,
  newStartDate: Date,
  newEndDate: Date,
  excludeRecordId?: string,
): Promise<void>
```

**Uses PostgreSQL's OVERLAPS operator:**
```sql
WHERE (contract_start_date, contract_end_date) 
OVERLAPS (:newStart, :newEnd)
```

**Prevents:**
- Date range overlaps
- Duplicate date ranges

---

### 2. Status-Based Exit Validation

**Regular Employees:**
```typescript
// Can use: RESIGNED, RETIRED, TERMINATED
if ([RESIGNED, RETIRED, TERMINATED].includes(newStatus)) {
  return; // ✅ Valid
}
```

**Contract Employees:**
```typescript
// Can use: RESIGNED (during contract), TERMINATED (after contract)
if (newStatus === RESIGNED) {
  if (now < contractEndDate) {
    return; // ✅ Valid resignation
  }
}

if (newStatus === RETIRED) {
  throw Error('RETIRED only for Regular'); // ❌ Invalid
}
```

---

## Database Changes Required

### 1. Update Enum in Database

```sql
-- Add new statuses to enum
ALTER TYPE employment_status ADD VALUE IF NOT EXISTS 'Resigned';
ALTER TYPE employment_status ADD VALUE IF NOT EXISTS 'Retired';
```

### 2. Optional: Add Index for Contract Queries

```sql
-- Speed up contract overlap checks
CREATE INDEX idx_employee_contract_dates 
ON employee_core_work_info (employee_id, contract_start_date, contract_end_date)
WHERE employment_type = 'Contract' AND deleted_at IS NULL;
```

---

## API Usage Examples

### Example 1: Contract Renewal

**Step 1: Initial Contract**
```bash
POST /api/employees/job-details
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Active",
  "contractStartDate": "2026-01-04",
  "contractEndDate": "2026-07-04"
}
```

**Step 2: Renew Contract**
```bash
POST /api/employees/job-details
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Technician",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Active",
  "contractStartDate": "2026-07-05",
  "contractEndDate": "2027-01-05"
}
```

---

### Example 2: Regular Employee Resignation

```bash
POST /api/employees/job-details
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "Senior Developer",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Resigned"
}
```

---

### Example 3: Regular Employee Retirement

```bash
POST /api/employees/job-details
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "Senior Developer",
  "department": "IT Department",
  "employmentType": "Regular",
  "employmentStatus": "Retired"
}
```

---

### Example 4: Contract Employee Resignation

```bash
POST /api/employees/job-details
{
  "employee": "019ac2c0-8a31-771e-a485-d9c7bcebcd3b",
  "position": "IT Consultant",
  "department": "IT Department",
  "employmentType": "Contract",
  "employmentStatus": "Resigned"
}
```

---

## Testing Scenarios

### ✅ Valid Scenarios

1. **Multiple non-overlapping contracts**
   - Contract 1: Jan-Jun
   - Contract 2: Jul-Dec ✅

2. **Back-to-back contracts**
   - Contract 1: Ends July 4
   - Contract 2: Starts July 5 ✅

3. **Regular employee resignation**
   - Current: Regular, Active
   - New: Regular, Resigned ✅

4. **Regular employee retirement**
   - Current: Regular, Active
   - New: Regular, Retired ✅

5. **Contract employee resignation**
   - Current: Contract, Active (not expired)
   - New: Contract, Resigned ✅

---

### ❌ Invalid Scenarios

1. **Overlapping contracts**
   - Contract 1: Jan-Jun
   - Contract 2: May-Oct ❌

2. **Duplicate contract dates**
   - Contract 1: Jan-Jun
   - Contract 2: Jan-Jun ❌

3. **Contract employee retirement**
   - Current: Contract, Active
   - New: Contract, Retired ❌

4. **Probation employee resignation**
   - Current: Probation, Active
   - New: Probation, Resigned ❌ (Use TERMINATED)

5. **Contract start before current ends**
   - Current: Ends July 4
   - New: Starts June 1 ❌

---

## Benefits

### 1. 📊 Better Data Tracking
- Distinguish between voluntary and involuntary exits
- Track retirement separately from termination
- Maintain complete contract history

### 2. 📈 Business Intelligence
- Analyze resignation patterns
- Track retirement eligibility
- Monitor contract renewal rates

### 3. 🔒 Data Integrity
- Prevent overlapping contracts
- Ensure accurate contract timelines
- Maintain proper employment history

### 4. 🎯 Compliance
- Proper documentation of employee exits
- Clear contract renewal trail
- Audit-ready employment records

---

## Migration Steps

1. **Update Enum File**
   ```bash
   src/modules/employees/enums/employee.enum.ts
   ```

2. **Update Database Enum**
   ```sql
   ALTER TYPE employment_status ADD VALUE 'Resigned';
   ALTER TYPE employment_status ADD VALUE 'Retired';
   ```

3. **Update Validation Service**
   ```bash
   src/modules/employees/services/employment-validation.service.ts
   ```

4. **Test All Scenarios**
   - Contract renewals
   - Employee resignations
   - Employee retirements
   - Invalid transitions

5. **Update Documentation**
   - API documentation
   - HR user guides
   - Training materials

---

## Summary

✅ **Contract employees can now have multiple contracts**  
✅ **Three exit statuses: RESIGNED, RETIRED, TERMINATED**  
✅ **Proper validation for overlaps and duplicates**  
✅ **Status restrictions based on employment type**  
✅ **Complete employment history tracking**

