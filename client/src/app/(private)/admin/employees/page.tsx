// app/(private)/admin/employees/page.tsx
import EmployeeTable from '@/containers/employee-containers/employee-table';

export const metadata = {
  title: 'Employees | Admin Panel',
};

export default function EmployeesPage() {
  return <EmployeeTable />;
}
