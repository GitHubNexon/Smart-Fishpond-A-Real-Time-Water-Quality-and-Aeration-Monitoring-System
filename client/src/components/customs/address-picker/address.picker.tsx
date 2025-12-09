// src/components/customs/address-picker/address-picker.tsx
'use client';

import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { MapPin } from 'lucide-react';
import useAddressPickerLogic, {
  AddressValues,
  Region,
  Province,
  City,
  Barangay,
} from './address-picker.logic';

export interface AddressPickerProps {
  values: AddressValues;
  onChange: (field: string, value: string) => void;
  fieldPrefix?: string;
  disabled?: boolean;
  showLabels?: boolean;
}

export default function AddressPicker({
  values,
  onChange,
  fieldPrefix = '',
  disabled = false,
  showLabels = true,
}: AddressPickerProps) {
  const {
    regions,
    filteredProvinces,
    filteredCities,
    filteredBarangays,
    selectedRegion,
    selectedProvince,
    selectedCity,
    selectedBarangay,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
  } = useAddressPickerLogic({ values, onChange, fieldPrefix });

  return (
    <div className="space-y-4">
      <ComboBox<Region>
        label={showLabels ? 'Region' : undefined}
        options={regions}
        value={selectedRegion || undefined}
        onSelect={(item) => handleRegionChange(item as Region | null)}
        getOptionLabel={(item) => item.region_name}
        searchKey={['region_name']}
        placeholder="Select region"
        icon={<MapPin className="w-4 h-4" />}
        isClearable
      />

      <ComboBox<Province>
        label={showLabels ? 'Province' : undefined}
        options={filteredProvinces}
        value={selectedProvince || undefined}
        onSelect={(item) => handleProvinceChange(item as Province | null)}
        getOptionLabel={(item) => item.province_name}
        searchKey={['province_name']}
        placeholder={selectedRegion ? 'Select province' : 'Select region first'}
        icon={<MapPin className="w-4 h-4" />}
        isClearable
      />

      <ComboBox<City>
        label={showLabels ? 'City/Municipality' : undefined}
        options={filteredCities}
        value={selectedCity || undefined}
        onSelect={(item) => handleCityChange(item as City | null)}
        getOptionLabel={(item) => item.city_name}
        searchKey={['city_name']}
        placeholder={selectedProvince ? 'Select city' : 'Select province first'}
        icon={<MapPin className="w-4 h-4" />}
        isClearable
      />

      <ComboBox<Barangay>
        label={showLabels ? 'Barangay' : undefined}
        options={filteredBarangays}
        value={selectedBarangay || undefined}
        onSelect={(item) => handleBarangayChange(item as Barangay | null)}
        getOptionLabel={(item) => item.brgy_name}
        searchKey={['brgy_name']}
        placeholder={selectedCity ? 'Select barangay' : 'Select city first'}
        icon={<MapPin className="w-4 h-4" />}
        isClearable
      />
    </div>
  );
}
