// src/components/customs/address-picker/address-picker.logic.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import regionData from './json/region.json';
import provinceData from './json/province.json';
import cityData from './json/city.json';
import barangayData from './json/barangay.json';

export interface Region {
  id: number;
  psgc_code: string;
  region_name: string;
  region_code: string;
}

export interface Province {
  id: string;
  province_code: string;
  province_name: string;
  psgc_code: string;
  region_code: string;
}

export interface City {
  id: string;
  city_code: string;
  city_name: string;
  province_code: string;
  psgc_code: string;
  region_desc: string;
}

export interface Barangay {
  id: string;
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
  region_code: string;
}

export interface AddressValues {
  region?: string;
  province?: string;
  city?: string;
  barangay?: string;
}

export interface AddressPickerLogicProps {
  values: AddressValues;
  onChange: (field: string, value: string) => void;
  fieldPrefix?: string; // e.g., 'addressInfo' for nested fields
}

export default function useAddressPickerLogic({
  values,
  onChange,
  fieldPrefix = '',
}: AddressPickerLogicProps) {
  const regions = regionData as Region[];
  const provinces = provinceData as Province[];
  const cities = cityData as City[];
  const barangays = barangayData as Barangay[];

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(
    null,
  );

  // Helper to build field name
  const getFieldName = (field: string) =>
    fieldPrefix ? `${fieldPrefix}.${field}` : field;

  // (ERROR not clearing if using reset on parent form)
  // useEffect(() => {
  //   if (values.region) {
  //     const region = regions.find((r) => r.region_name === values.region);
  //     if (region) setSelectedRegion(region);
  //   }

  //   if (values.province) {
  //     const province = provinces.find(
  //       (p) => p.province_name === values.province,
  //     );
  //     if (province) setSelectedProvince(province);
  //   }

  //   if (values.city) {
  //     const city = cities.find((c) => c.city_name === values.city);
  //     if (city) setSelectedCity(city);
  //   }

  //   if (values.barangay) {
  //     const barangay = barangays.find((b) => b.brgy_name === values.barangay);
  //     if (barangay) setSelectedBarangay(barangay);
  //   }
  // }, [values]);

  // Initialize selections based on values
  useEffect(() => {
    if (!values.region) {
      setSelectedRegion(null);
    } else {
      const region = regions.find((r) => r.region_name === values.region);
      setSelectedRegion(region ?? null);
    }

    if (!values.province) {
      setSelectedProvince(null);
    } else {
      const province = provinces.find(
        (p) => p.province_name === values.province,
      );
      setSelectedProvince(province ?? null);
    }

    if (!values.city) {
      setSelectedCity(null);
    } else {
      const city = cities.find((c) => c.city_name === values.city);
      setSelectedCity(city ?? null);
    }

    if (!values.barangay) {
      setSelectedBarangay(null);
    } else {
      const barangay = barangays.find((b) => b.brgy_name === values.barangay);
      setSelectedBarangay(barangay ?? null);
    }
  }, [values]);

  // Filter provinces based on selected region
  const filteredProvinces = useMemo(() => {
    if (!selectedRegion) return [];
    return provinces.filter(
      (p) => p.region_code === selectedRegion.region_code,
    );
  }, [selectedRegion, provinces]);

  // Filter cities based on selected province
  const filteredCities = useMemo(() => {
    if (!selectedProvince) return [];
    return cities.filter(
      (c) => c.province_code === selectedProvince.province_code,
    );
  }, [selectedProvince, cities]);

  // Filter barangays based on selected city
  const filteredBarangays = useMemo(() => {
    if (!selectedCity) return [];
    return barangays.filter((b) => b.city_code === selectedCity.city_code);
  }, [selectedCity, barangays]);

  // Handle region selection
  const handleRegionChange = (region: Region | null) => {
    setSelectedRegion(region);
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedBarangay(null);

    onChange(getFieldName('region'), region?.region_name || '');
    onChange(getFieldName('province'), '');
    onChange(getFieldName('city'), '');
    onChange(getFieldName('barangay'), '');
  };

  // Handle province selection
  const handleProvinceChange = (province: Province | null) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    setSelectedBarangay(null);

    onChange(getFieldName('province'), province?.province_name || '');
    onChange(getFieldName('city'), '');
    onChange(getFieldName('barangay'), '');
  };

  // Handle city selection
  const handleCityChange = (city: City | null) => {
    setSelectedCity(city);
    setSelectedBarangay(null);

    onChange(getFieldName('city'), city?.city_name || '');
    onChange(getFieldName('barangay'), '');
  };

  // Handle barangay selection
  const handleBarangayChange = (barangay: Barangay | null) => {
    setSelectedBarangay(barangay);
    onChange(getFieldName('barangay'), barangay?.brgy_name || '');
  };

  return {
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
  };
}
