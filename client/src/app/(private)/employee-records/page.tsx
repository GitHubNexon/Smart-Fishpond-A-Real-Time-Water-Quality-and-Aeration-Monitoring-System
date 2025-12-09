// import EmployeeTable from './components/employee-table';
import EmployeeRecordsContent from './employee-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Records',
  description: 'Access Employee data, analytics, and system insights',
};

export default function EmployeeRecords() {
  return (
    <div className="m-5 p-1">
      <EmployeeRecordsContent />
    </div>
  );
}
