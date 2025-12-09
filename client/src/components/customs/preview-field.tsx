// src/components/PreviewField.tsx

import React from 'react';

interface PreviewFieldProps {
  label: string;
  value: any;
  changed?: boolean;
}

export const PreviewField: React.FC<PreviewFieldProps> = ({
  label,
  value,
  changed = false,
}) => {
  return (
    <div className="flex justify-between border-b border-border/30 pb-2 last:border-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span
        className={`text-sm font-semibold text-right transition-colors ${
          changed ? 'text-blue-600' : 'text-foreground'
        }`}
      >
        {value || '-'}
      </span>
    </div>
  );
};
