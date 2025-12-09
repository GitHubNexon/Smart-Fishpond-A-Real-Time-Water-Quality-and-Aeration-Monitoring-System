// src/components/customs/drawer.component.tsx

'use client';
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DrawerComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonText?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function DrawerComponent({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  closeButtonText = 'Close',
  direction = 'bottom',
  className,
}: DrawerComponentProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent className={className}>
        <div className="mx-auto w-full max-w-6xl h-full flex flex-col">
          {(title || description) && (
            <DrawerHeader className="text-left">
              <div className="flex items-start justify-between">
                <div>
                  {title && <DrawerTitle>{title}</DrawerTitle>}
                  {description && (
                    <DrawerDescription>{description}</DrawerDescription>
                  )}
                </div>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
          )}

          <div className="flex-1 overflow-y-auto px-4">{children}</div>

          {(footer || showCloseButton) && (
            <DrawerFooter>
              {footer}
              {showCloseButton && !footer && (
                <DrawerClose asChild>
                  <Button variant="outline">{closeButtonText}</Button>
                </DrawerClose>
              )}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
