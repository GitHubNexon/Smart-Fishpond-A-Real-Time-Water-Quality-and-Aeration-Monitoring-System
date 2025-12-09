//src/components/customs/combobox/combo-box.demo.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ComboBox } from "./combo-box.component";
import { getAllRolesList } from "@/api/protected/rbac.api";
import { FaUserShield } from "react-icons/fa"

export default function ComboBoxDemo() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getAllRolesList();
        setRoles(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">ComboBox Demo</h2>
      <ComboBox
        label="Select Role"
        options={roles}
        value={selected}
        onSelect={setSelected}
        searchKey={["role", "description"]}
        loading={loading}
        placeholder="Search role..."
        isClearable
        icon={<FaUserShield />}
      />

      <pre className="mt-4 p-2 bg-muted rounded">
        Selected: {JSON.stringify(selected, null, 2)}
      </pre>
    </div>
  );
}
