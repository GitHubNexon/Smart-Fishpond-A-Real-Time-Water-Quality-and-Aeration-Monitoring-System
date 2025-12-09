'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { showToastSuccess } from '@/utils/toast-config';

interface TransactionNoPopUpProps {
  open: boolean;
  transactionNo: string;
  onClose: () => void;
}

export default function TransactionNoPopUp({
  open,
  transactionNo,
  onClose,
}: TransactionNoPopUpProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(transactionNo);
     showToastSuccess(
       'Transaction No',
       `Transaction number copied to clipboard!`,
       'top-center',
     );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Saved</DialogTitle>
          <DialogDescription>
            Your transaction has been successfully created. Please keep a copy
            of your reference number.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 p-4 bg-muted rounded-lg flex items-center justify-between dark:bg-muted/80">
          <span className="font-mono text-lg">{transactionNo}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" /> Copy
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
