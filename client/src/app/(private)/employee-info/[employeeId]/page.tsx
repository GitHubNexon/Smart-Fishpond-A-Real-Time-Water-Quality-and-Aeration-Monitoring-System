'use client';

import * as React from 'react';
import EmployeeProfileComponent from './employee-profile.component';

interface EmployeeProfilePageProps {
  params: Promise<{ employeeId: string }>;
}

export default function EmployeeProfilePage({
  params,
}: EmployeeProfilePageProps) {
  const resolvedParams = React.use(params);

  return (
    <div className="mx-auto p-8">
      <EmployeeProfileComponent employeeId={resolvedParams.employeeId} />
    </div>
  );
}
