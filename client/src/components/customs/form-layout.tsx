// src/components/customs/form-layout.tsx
import React from 'react';
import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================
// COMPONENTS
// ============================================

/**
 * FormContainer - Main wrapper for form content
 * Provides consistent spacing between sections
 */
export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  className = '',
}) => {
  return <div className={cn('space-y-8', className)}>{children}</div>;
};

/**
 * FormSection - Groups related form fields with optional icon and description
 * Creates visual hierarchy and improves form readability
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  className = '',
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-start gap-3 pb-3 border-b border-border/50">
        {icon && (
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

/**
 * FormGrid - Responsive grid layout for form fields
 * Automatically adjusts columns based on screen size
 */
export const FormGrid: React.FC<FormGridProps> = ({
  children,
  columns = 2,
  className = '',
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn('grid gap-4', gridClasses[columns], className)}>
      {children}
    </div>
  );
};

/**
 * FormField - Individual form field wrapper
 * Handles label, icon, helper text, and error states
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  icon,
  required,
  helper,
  error,
  children,
  fullWidth = false,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'space-y-2',
        fullWidth && 'md:col-span-2 lg:col-span-3',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex-shrink-0 w-5 h-5 text-muted-foreground">
            {icon}
          </div>
        )}
        <Label className="text-sm font-medium text-foreground flex items-center gap-1">
          {label}
          {required && (
            <span className="text-destructive text-base leading-none">*</span>
          )}
        </Label>
      </div>
      <div className="relative">{children}</div>
      {helper && !error && (
        <p className="text-xs text-muted-foreground flex items-start gap-1.5 leading-relaxed">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{helper}</span>
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-start gap-1.5 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

// ============================================
// UTILITY COMPONENT: FormDivider
// ============================================

interface FormDividerProps {
  className?: string;
}

export const FormDivider: React.FC<FormDividerProps> = ({ className = '' }) => {
  return <div className={cn('h-px bg-border/50 my-6', className)} />;
};

// ============================================
// UTILITY COMPONENT: FormFooter
// ============================================

interface FormFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFooter: React.FC<FormFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-border/50',
        className,
      )}
    >
      {children}
    </div>
  );
};

// ============================================
// EXPORT ALL COMPONENTS
// ============================================

export default {
  Container: FormContainer,
  Section: FormSection,
  Grid: FormGrid,
  Field: FormField,
  Divider: FormDivider,
  Footer: FormFooter,
};
