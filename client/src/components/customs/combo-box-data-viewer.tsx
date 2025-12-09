import React, { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ComboBoxDataViewerProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  disabled?: boolean;
  dialogTitle?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  maxWidth?: string;
}

export function ComboBoxDataViewer({
  children,
  trigger,
  disabled = false,
  dialogTitle = 'Details',
  tooltipSide = 'right',
  maxWidth = 'max-w-md',
}: ComboBoxDataViewerProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6"
      disabled={disabled}
      type="button"
    >
      <Info className="h-4 w-4" />
    </Button>
  );

  const triggerElement = trigger || defaultTrigger;

  return (
    <>
      {/* Desktop: Tooltip with Card (hover) */}
      <div className="hidden md:inline-block">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild disabled={disabled}>
              {triggerElement}
            </TooltipTrigger>
            <TooltipContent side={tooltipSide} className={`p-0 ${maxWidth}`}>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">{children}</CardContent>
              </Card>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile: Dialog with Button (click) */}
      <div className="inline-block md:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild disabled={disabled}>
            {triggerElement}
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">{children}</div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
