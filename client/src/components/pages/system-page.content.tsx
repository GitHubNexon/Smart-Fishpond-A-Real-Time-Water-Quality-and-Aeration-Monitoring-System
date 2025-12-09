'use client';

import React, { useEffect, useState } from 'react';
import { X, Type, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeButtons } from '@/components/customs/theme-buttons';
import { Settings } from 'lucide-react';

// font options (must match what's loaded via next/font)
const FONT_KEY = 'user-font';
const FONTS = [
  { id: 'bebasNeue', name: 'Bebas Neue', variable: 'var(--font-bebas-neue)' },
  { id: 'geist', name: 'Geist Sans', variable: 'var(--font-geist-sans)' },
  { id: 'inter', name: 'Inter', variable: 'var(--font-inter)' },
  { id: 'roboto', name: 'Roboto', variable: 'var(--font-roboto)' },
  { id: 'poppins', name: 'Poppins', variable: 'var(--font-poppins)' },
  { id: 'montserrat', name: 'Montserrat', variable: 'var(--font-montserrat)' },
  { id: 'openSans', name: 'Open Sans', variable: 'var(--font-open-sans)' },
  { id: 'lato', name: 'Lato', variable: 'var(--font-lato)' },
  { id: 'raleway', name: 'Raleway', variable: 'var(--font-raleway)' },
  {
    id: 'playfair',
    name: 'Playfair Display',
    variable: 'var(--font-playfair)',
  },
  { id: 'geistMono', name: 'Geist Mono', variable: 'var(--font-geist-mono)' },
  { id: 'kodeMono', name: 'Kode Mono', variable: 'var(--font-kode-mono)' },
];

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

export default function SystemPageContent({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = true,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [font, setFont] = useState<string>('roboto');

  const open = controlledOpen ?? internalOpen;

  function handleOpenChange(next: boolean) {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  }

  // Load font on mount
  useEffect(() => {
    const savedFont = localStorage.getItem(FONT_KEY) || 'roboto';
    setFont(savedFont);
    const selected = FONTS.find((f) => f.id === savedFont);
    if (selected) {
      document.body.style.setProperty('--active-font', selected.variable);
    }
  }, []);

  // Change font
  const handleFontChange = (fontId: string) => {
    setFont(fontId);
    localStorage.setItem(FONT_KEY, fontId);
    const selected = FONTS.find((f) => f.id === fontId);
    if (selected) {
      document.body.style.setProperty('--active-font', selected.variable);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-2xl mx-auto rounded-xl p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings /> System Preference
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          {/* Theme Section */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-sm uppercase tracking-wide">
                Theme
              </h3>
            </div>
            <ThemeButtons />
          </div>

          {/* Divider (visible on desktop) */}
          <div className="hidden sm:block w-px bg-gray-200 dark:bg-zinc-700" />

          {/* Font Section */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-sm uppercase tracking-wide">
                Font
              </h3>
            </div>
            <RadioGroup value={font} onValueChange={handleFontChange}>
              <div className="space-y-2">
                {FONTS.map((f) => (
                  <div key={f.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={f.id} id={f.id} />
                    <Label
                      htmlFor={f.id}
                      className="flex-1 cursor-pointer text-sm"
                      style={{ fontFamily: f.variable }}
                    >
                      {f.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogClose asChild>
          <button
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
