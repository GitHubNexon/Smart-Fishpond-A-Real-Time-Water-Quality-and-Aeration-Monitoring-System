'use client';

import React, { useMemo } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { FaLock, FaKey } from 'react-icons/fa6';
import { routesByCategory } from '@/utils/route-constants';
import { toast } from '@/components/ui/sonner';
import { roleAccessMap } from './role-access.map';

interface AccessPickerProps {
  value: string[];
  onSelect: (selected: string[]) => void;
  selectedRole: any | null; // Role object
}

export default function AccessPicker({
  value,
  onSelect,
  selectedRole,
}: AccessPickerProps) {
  // Helper to get route label from route value
  const getLabelFromValue = (routeValue: string) => {
    for (const category of Object.values(routesByCategory)) {
      const found = category.find((r) => r.value === routeValue);
      if (found) return found.label;
    }
    return routeValue; // fallback
  };

  // Get allowed routes for the selected role
  const filteredRoutes = useMemo(() => {
    if (!selectedRole) return [];

    const roleName =
      selectedRole.role?.toLowerCase() ||
      selectedRole.name?.toLowerCase() ||
      '';
    const allowedRoutes = roleAccessMap[roleName] || [];

    return allowedRoutes.map((route) => ({
      id: route,
      label: getLabelFromValue(route), // <--- use friendly label
    }));
  }, [selectedRole]);

  const selectedOptions = filteredRoutes.filter((o) => value.includes(o.id));

  const handleSelect = (
    selected: { id: string; label?: string } | { id: string; label?: string }[],
  ) => {
    const arr = Array.isArray(selected) ? selected : [selected];

    if (arr.length === 0) {
      toast.error({
        title: 'Access Required',
        description: 'At least one route must be selected',
      });
      return;
    }

    // Only allow routes that are valid for this role
    const validIds = arr
      .map((s) => s.id)
      .filter((id) => filteredRoutes.some((r) => r.id === id));

    onSelect(validIds);
  };

  return (
    <div className="relative">
      <ComboBox
        options={filteredRoutes}
        value={selectedOptions.length > 0 ? selectedOptions : undefined}
        onSelect={handleSelect}
        searchKey={['label', 'id']}
        placeholder={
          selectedRole ? 'Select allowed routes...' : 'Select a role first'
        }
        isClearable={false}
        icon={<FaKey />}
        isMulti
      />
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <FaLock className="w-3 h-3" />
        <span>
          {selectedRole
            ? `Showing routes for: ${selectedRole.role || selectedRole.name}`
            : 'Select a role to see available routes'}
        </span>
      </div>
    </div>
  );
}
