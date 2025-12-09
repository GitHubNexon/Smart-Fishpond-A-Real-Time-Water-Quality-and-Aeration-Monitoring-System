'use client';

import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { getUserById } from '@/api/protected/user.api';
import { extractErrorMessage } from '@/configs/api.helper';

interface PermissionWrapperProps {
  permission: string | string[];
  children: React.ReactNode;
}

export default function PermissionWrapper({
  permission,
  children,
}: PermissionWrapperProps) {
  const { user: authUser, loading: authLoading } = useAuthCheck();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // normalize permission(s)
  const requiredPermissions = Array.isArray(permission)
    ? permission
    : [permission];

  // fetch the full user info (with permissions)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) return;
      try {
        const res = await getUserById(authUser.id);
        // res.data.data.user structure based on your controller
        setUserData(res.data);
      } catch (err) {
        console.error(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [authUser?.id]);

  if (authLoading || loading) return null;
  if (!userData) return null;

  const hasPermission = userData.permissions?.some((p: any) =>
    requiredPermissions.includes(p.permission),
  );

  return hasPermission ? <>{children}</> : null;
}

/**
 * 
 * SINGLE
 * 
 <PermissionWrapper permission="Create">
  <Button>Add New</Button>
</PermissionWrapper>

* MULTIPLE
* <PermissionWrapper permission={["Create", "Update"]}>
  <Button>Edit</Button>
</PermissionWrapper>

 */
