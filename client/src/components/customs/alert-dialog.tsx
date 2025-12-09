
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IoWarningOutline } from 'react-icons/io5';

interface AlertDialogProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  isProceed?: string;
  isCanceled?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  icon = <IoWarningOutline className="w-8 h-8 text-yellow-500" />,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm to proceed.',
  isProceed = 'Yes, Proceed',
  isCanceled = 'Cancel',
  onConfirm,
  onCancel,
  isOpen,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-zinc-300 dark:bg-background">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto">{icon}</div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            {isCanceled}
          </Button>
          <Button variant="default" onClick={onConfirm} className="w-full sm:w-auto">
            {isProceed}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
