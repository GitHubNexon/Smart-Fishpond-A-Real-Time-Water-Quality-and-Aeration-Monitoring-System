'use client';

import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface FormPreviewerProps {
  headerTitle?: string;
  description?: string;
  footerText?: string;
  isOpen: boolean;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
  onClose: () => void;
  onSave?: () => void;
  disableOutsideClick?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * FormPreviewer
 * - Locks background (no scroll or click outside)
 * - Ignores outside clicks if disableOutsideClick = true
 */
const FormPreviewer: React.FC<FormPreviewerProps> = ({
  headerTitle = 'Preview',
  description,
  footerText = 'Continue',
  isOpen,
  before,
  after,
  onClose,
  onSave,
  disableOutsideClick = true,
  children,
  disabled = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableOutsideClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity pointer-events-auto',
      )}
      onClick={handleBackdropClick}
    >
      <Card
        className="relative w-full max-w-3xl mx-4 shadow-lg border rounded-2xl bg-background pointer-events-auto"
        onClick={(e) => e.stopPropagation()} // Prevent bubbling
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <CardHeader>
          <CardTitle>{headerTitle}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-4 max-h-[65vh] overflow-y-auto">
          {children ? (
            children
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No preview content provided.
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-end space-x-3 border-t pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {onSave && (
            <Button
              onClick={onSave}
              disabled={disabled}
              className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {footerText || 'Confirm'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormPreviewer;
