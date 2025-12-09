"use client";

import React, { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

type ModalProps = {
  open: boolean;
  close: () => void;
  title?: React.ReactNode;
  children?: ReactNode;
  headerChildren?: ReactNode;
  footerChildren?: ReactNode;
  width?: string;
};

const Modal: React.FC<ModalProps> = ({
  open,
  close,
  title = "",
  children,
  headerChildren,
  footerChildren,
  width = "max-w-full",
}) => {
  const contentWidthClass = twMerge('w-full', width);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        className={twMerge(
          'p-0 rounded-2xl shadow-xl transform transition-all duration-300',
          contentWidthClass,
        )}
      >
        <Card className="overflow-hidden p-1">
          {/* Header */}
          <DialogHeader className="flex items-start justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              {title && (
                <DialogTitle className="text-lg font-semibold">
                  {title}
                </DialogTitle>
              )}
              {headerChildren}
            </div>
          </DialogHeader>

          {/* Body */}
          <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
            {children}
          </CardContent>

          {/* Footer */}
          {footerChildren && (
            <DialogFooter className="px-6 py-4 border-t border-gray-800">
              {footerChildren}
            </DialogFooter>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
