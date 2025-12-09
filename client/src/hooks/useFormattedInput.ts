// src/hooks/useFormattedInput.ts

import { useState, useCallback } from 'react';
import {
  formatNumber,
  parseFormattedNumber,
  FormatNumberOptions,
} from '@/utils/format-number.util';

interface UseFormattedInputProps {
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  formatOptions?: FormatNumberOptions;
}

interface UseFormattedInputReturn {
  displayValue: string;
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputProps: {
    name: string;
    value: string;
    onFocus: () => void;
    onBlur: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  };
}

/**
 * Custom hook for handling formatted numeric inputs
 * Displays formatted value when not focused, raw value when focused
 */
export const useFormattedInput = ({
  name,
  value,
  onChange,
  formatOptions = { type: 'number' },
}: UseFormattedInputProps): UseFormattedInputReturn => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value.toString());

  const displayValue = isFocused
    ? internalValue
    : formatNumber(value, formatOptions);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setInternalValue(value.toString());
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Clean up the internal value on blur
    const cleanedValue = internalValue.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanedValue);
    if (!isNaN(parsed)) {
      onChange(name, parsed);
    }
  }, [internalValue, name, onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty input
      if (inputValue === '') {
        setInternalValue('');
        onChange(name, 0);
        return;
      }

      // Remove any formatting characters except digits, decimal point, and minus sign
      const cleanedValue = inputValue.replace(/[^\d.-]/g, '');

      // Check if it's a valid number format
      const regex = /^-?\d*\.?\d*$/;
      if (regex.test(cleanedValue)) {
        // Update internal value with what user typed (allows commas)
        setInternalValue(inputValue);

        const parsed = parseFloat(cleanedValue);
        if (!isNaN(parsed)) {
          onChange(name, parsed);
        } else if (
          cleanedValue === '-' ||
          cleanedValue === '.' ||
          cleanedValue === '-.' ||
          cleanedValue === ''
        ) {
          // Allow intermediate states
          // Keep internal value but don't update parent yet
        }
      }
    },
    [name, onChange],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');

      // Remove any formatting characters (commas, currency symbols, spaces)
      const cleanedValue = pastedText.replace(/[^\d.-]/g, '');

      const parsed = parseFloat(cleanedValue);
      if (!isNaN(parsed)) {
        setInternalValue(pastedText);
        onChange(name, parsed);
      }
    },
    [name, onChange],
  );

  return {
    displayValue,
    isFocused,
    handleFocus,
    handleBlur,
    handleChange,
    handlePaste,
    inputProps: {
      name,
      value: displayValue,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
      onPaste: handlePaste,
    },
  };
};
