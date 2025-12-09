// src/utils/format-number.util.ts

export type NumberFormatType = 'currency' | 'number' | 'percentage' | 'decimal';

export interface FormatNumberOptions {
  type?: NumberFormatType;
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
}

/**
 * Formats a number based on the specified type and options
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted string
 */
export const formatNumber = (
  value: number | string,
  options: FormatNumberOptions = {},
): string => {
  const {
    type = 'number',
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping = true,
  } = options;

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '';
  }

  const baseOptions: Intl.NumberFormatOptions = {
    useGrouping,
  };

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat(locale, {
        ...baseOptions,
        style: 'currency',
        currency,
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }).format(numValue);

    case 'percentage':
      return new Intl.NumberFormat(locale, {
        ...baseOptions,
        style: 'percent',
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }).format(numValue / 100);

    case 'decimal':
      return new Intl.NumberFormat(locale, {
        ...baseOptions,
        minimumFractionDigits: minimumFractionDigits ?? 2,
        maximumFractionDigits: maximumFractionDigits ?? 2,
      }).format(numValue);

    case 'number':
    default:
      return new Intl.NumberFormat(locale, {
        ...baseOptions,
        minimumFractionDigits: minimumFractionDigits ?? 0,
        maximumFractionDigits: maximumFractionDigits ?? 0,
      }).format(numValue);
  }
};

/**
 * Parses a formatted number string back to a number
 * @param value - The formatted string
 * @param locale - The locale used for formatting
 * @returns Parsed number
 */
export const parseFormattedNumber = (
  value: string,
  locale: string = 'en-US',
): number => {
  if (!value) return 0;

  // Remove currency symbols, percentage signs, and other non-numeric characters
  // Keep digits, decimal separator, and minus sign
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.67);
  const decimalSeparator =
    parts.find((p) => p.type === 'decimal')?.value || '.';
  const groupSeparator = parts.find((p) => p.type === 'group')?.value || ',';

  let cleanedValue = value
    .replace(new RegExp(`[^0-9${decimalSeparator}-]`, 'g'), '')
    .replace(new RegExp(`\\${groupSeparator}`, 'g'), '');

  // Normalize decimal separator to dot
  if (decimalSeparator !== '.') {
    cleanedValue = cleanedValue.replace(decimalSeparator, '.');
  }

  const parsed = parseFloat(cleanedValue);
  return isNaN(parsed) ? 0 : parsed;
};
