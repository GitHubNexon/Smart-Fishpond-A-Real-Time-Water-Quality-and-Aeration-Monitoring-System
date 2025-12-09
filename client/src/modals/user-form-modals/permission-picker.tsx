'use client';

import React, { useEffect, useState } from 'react';
import { ComboBox } from '@/components/customs/combobox/combo-box.component';
import { getAllPermissionList } from '@/api/protected/rbac.api';
import { FaKey, FaLock } from 'react-icons/fa6';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';

interface PermissionPickerProps {
  value: any[];
  onSelect: (permissions: any[]) => void;
}

export default function PermissionPicker({
  value,
  onSelect,
}: PermissionPickerProps) {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const selected =
    value && permissions.length > 0
      ? permissions.filter((p) => value.some((v) => v.id === p.id))
      : [];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllPermissionList();
        setPermissions(res.data || []);
      } catch (e) {
        const message = extractErrorMessage(e);
        toast.error({
          title: 'Operation failed',
          description: message,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelect = (newPermissions: any[]) => {
    const viewPermission = permissions.find(
      (p) => p.permission?.toLowerCase() === 'view',
    );

    if (viewPermission) {
      const hasViewInNew = newPermissions.some(
        (p) => p.id === viewPermission.id,
      );
      const hasViewInCurrent = value.some((p) => p.id === viewPermission.id);

      if (hasViewInCurrent && !hasViewInNew) {
        toast.error({
          title: 'Permission Locked',
          description:
            'The "View" permission cannot be removed. It is required for all users.',
        });
        return;
      }
    }

    onSelect(newPermissions);
  };

  return (
    <div className="relative">
      <ComboBox
        options={permissions}
        value={selected.length > 0 ? selected : undefined}
        onSelect={handleSelect}
        searchKey={['permission']}
        loading={loading}
        placeholder="Search permission..."
        isClearable={false} 
        icon={<FaKey />}
        isMulti
      />
      {value.some((p) => p.permission?.toLowerCase() === 'view') && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <FaLock className="w-3 h-3" />
          <span>View permission is required and cannot be removed</span>
        </div>
      )}
    </div>
  );
}
