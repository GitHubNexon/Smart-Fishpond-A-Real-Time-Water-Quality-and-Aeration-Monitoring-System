"use client";

import React, { useEffect, useState } from "react";
import { ComboBox } from "@/components/customs/combobox/combo-box.component";
import { getAllRolesList } from "@/api/protected/rbac.api";
import { FaUserShield } from "react-icons/fa";
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';

interface RolePickerProps {
  value: any | null;
  onSelect: (role: any | null) => void;
}

export default function RolePicker({ value, onSelect }: RolePickerProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selected =
    value && roles.length > 0
      ? roles.find((r) => r.id === value.id) || null
      : null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllRolesList();
        setRoles(res.data || []);
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

  return (
    <ComboBox
      options={roles}
      value={selected}
      onSelect={onSelect}
      searchKey={["role", "description"]}
      loading={loading}
      placeholder="Search role..."
      isClearable
      icon={<FaUserShield />}
    />
  );
}
