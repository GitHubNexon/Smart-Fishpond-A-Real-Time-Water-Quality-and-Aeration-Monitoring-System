import {
  UsefulLifeUnit,
  DepreciationFrequency,
  DepreciationMethod,
} from '@/interfaces/assets-depreciation.api.interface';

// Helper function to format useful life unit
export const formatUsefulLifeUnit = (unit: string) => {
  if (unit === UsefulLifeUnit.YEARS) return 'Years';
  if (unit === UsefulLifeUnit.MONTHS) return 'Months';
  return unit;
};

// Helper function to format depreciation frequency
export const formatDepreciationFrequency = (freq: string) => {
  if (freq === DepreciationFrequency.MONTHLY) return 'Monthly';
  if (freq === DepreciationFrequency.QUARTERLY) return 'Quarterly';
  if (freq === DepreciationFrequency.ANNUAL) return 'Annual';
  return freq;
};

// Helper function to format depreciation method
export const formatDepreciationMethod = (method: string) => {
  if (method === DepreciationMethod.STRAIGHT_LINE) return 'Straight Line';
  if (method === DepreciationMethod.ACCELERATED) return 'Accelerated';
  return method;
};
