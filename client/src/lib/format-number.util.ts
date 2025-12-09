/**
 * Common number formatting utilities
 * You can use these across your app.
 */

type CurrencyCode = 'PHP' | 'USD' | 'EUR' | 'JPY' | 'NONE';

export const formatNumber = {
  /**
   * Format a raw number with commas.
   * Example: 1234567 → 1,234,567
   */
  withCommas: (value: number | string) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    return isNaN(num) ? '-' : num.toLocaleString();
  },

  /**
   * Format currency value.
   * @param value number
   * @param currency 'PHP' | 'USD' | 'EUR' | 'JPY' | 'NONE'
   * @param withSymbol whether to include the symbol
   * Example:
   *  - formatNumber.currency(1234.5, 'PHP') → ₱1,234.50
   *  - formatNumber.currency(1234.5, 'USD', false) → 1,234.50
   */
  currency: (
    value: number | string,
    currency: CurrencyCode = 'PHP',
    withSymbol = true,
  ) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';

    const symbols: Record<CurrencyCode, string> = {
      PHP: '₱',
      USD: '$',
      EUR: '€',
      JPY: '¥',
      NONE: '',
    };

    const formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return withSymbol ? `${symbols[currency]}${formatted}` : formatted;
  },

  /**
   * Format a quantity with unit.
   * Example:
   *  - formatNumber.quantity(5, 'pcs') → 5 pcs
   *  - formatNumber.quantity(2.5, 'kg') → 2.5 kg
   */
  quantity: (value: number | string, unit: string = 'pcs') => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';
    return `${num.toLocaleString()} ${unit}`;
  },

  /**
   * Format a percentage
   * Example:
   *  - formatNumber.percent(0.85) → 85%
   *  - formatNumber.percent(0.8567, true) → 85.67%
   */
  percent: (value: number | string, showDecimals = false) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';
    return `${(num * 100).toFixed(showDecimals ? 2 : 0)}%`;
  },
};
