// src/(private)/employee/[employeeId]/components/info-field.tsx
import React from 'react';

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
  compact?: boolean;
}

export function InfoField({
  label,
  value,
  icon,
  compact = false,
}: InfoFieldProps) {
  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <p
        className={`text-muted-foreground flex items-center gap-1 ${
          compact ? 'text-xs' : 'text-sm'
        } font-medium`}
      >
        {icon}
        {label}
      </p>
      <p className={`${compact ? 'text-sm' : 'text-base'} font-semibold`}>
        {value || 'N/A'}
      </p>
    </div>
  );
}
