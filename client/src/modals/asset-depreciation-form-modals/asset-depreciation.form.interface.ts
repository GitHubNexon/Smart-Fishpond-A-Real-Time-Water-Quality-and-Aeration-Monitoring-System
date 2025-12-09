import {
  UsefulLifeUnit,
  DepreciationFrequency,
  DepreciationMethod,
} from '@/interfaces/assets-depreciation.api.interface';
import { AssetsInfo } from '@/interfaces/assets.interface';

export interface DepreciationFormData {
  id?: string;
  asset: AssetsInfo | null;
  usefulLife: number;
  usefulLifeUnit: UsefulLifeUnit;
  salvageValue: number;
  firstDepreciationDate: string;
  frequency: DepreciationFrequency;
  depreciationMethod: DepreciationMethod;
}

export interface DepreciationPayload {
  id?: string;
  asset: AssetsInfo | null;
  usefulLife: number;
  usefulLifeUnit: UsefulLifeUnit;
  salvageValue: number;
  firstDepreciationDate: string;
  frequency: DepreciationFrequency;
  depreciationMethod: DepreciationMethod;
}
