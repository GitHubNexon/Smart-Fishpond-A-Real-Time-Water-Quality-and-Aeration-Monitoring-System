'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import UsersTable from '@/containers/users-containers/users-table';
// import RolesTable from '@/containers/rbac-containers/roles-table';
// import PermissionsTable from '@/containers/rbac-containers/permissions-table';
// import EmployeeTable from '@/containers/employee-containers/employee-table';
// import AuditLogsTable from '@/containers/audit-logs-containers/audit-logs-table';
import AssetTable from '@/containers/asset-containers/asset-table';
import AssetInventoryTable from '@/containers/asset-inventory-containers/asset-inventory-table';
import AssetDepreciationTable from '@/containers/asset-depreciation-containers/asset-depreciation.table';
import AssetTransactionTable from '@/containers/asset-transaction-contaners/asset-transaction.table';
import IssuanceTable from '@/containers/asset-issuance-containers/asset-issuance.table';
import TabsComponent from '@/components/customs/tabs/tabs-component';
import {
  UsersIcon,
  ShieldIcon,
  KeyRound,
  IdCardLanyard,
  Logs,
} from 'lucide-react';
import {
  FaFileAlt,
  FaBoxes,
  FaMoneyBillAlt,
  FaFileInvoice,
} from 'react-icons/fa';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { getUserById } from '@/api/protected/user.api';
import { canAccess } from '@/utils/check-access';
import { extractErrorMessage } from '@/configs/api.helper';

const DEFAULT_TAB = 'asset_records';

function ManagementPageContent() {
  const { user } = useAuthCheck();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [latestUser, setLatestUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  const urlTab = searchParams.get('tab');
  const isValidTab = [
    'asset_records',
    'asset_inventory',
    'depreciation_records',
    'asset_transaction',
    'issuance_transaction',
  ].includes(urlTab || '');
  const activeTab = isValidTab ? urlTab! : DEFAULT_TAB;

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        if (!user?.id) return;

        const response = await getUserById(user.id);
        const freshUser = response.data;
        setLatestUser(freshUser);

        const currentPath = `/management?tab=${activeTab}`;
        const allowed = canAccess(freshUser.access, currentPath);
        setIsAllowed(allowed);

        if (!allowed) {
          router.replace('/unauthorized');
        }
      } catch (error) {
        console.log(extractErrorMessage(error));
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUser();
  }, [user?.id, activeTab, router]);

  // Sync localStorage whenever activeTab changes (due to URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('managementActiveTab', activeTab);
    }
  }, [activeTab]);

  // Ensure URL always has a tab (redirect if missing or invalid)
  useEffect(() => {
    if (!urlTab || !isValidTab) {
      router.replace(`/management?tab=${DEFAULT_TAB}`, { scroll: false });
    }
  }, [urlTab, isValidTab, router]);

  if (loading || isAllowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isAllowed === false) return null;

  const items = [
    {
      value: 'asset_records',
      label: 'Asset Records',
      icon: FaFileAlt,
      component: <AssetTable />,
    },
    {
      value: 'asset_inventory',
      label: 'Inventory',
      icon: FaBoxes,
      component: <AssetInventoryTable />,
    },
    {
      value: 'depreciation_records',
      label: 'Depreciation Records',
      icon: FaMoneyBillAlt,
      component: <AssetDepreciationTable />,
    },
    {
      value: 'asset_transaction',
      label: 'Transaction Records',
      icon: FaFileInvoice,
      component: <AssetTransactionTable />,
    },
    {
      value: 'issuance_transaction',
      label: 'Issuance Records',
      icon: FaFileInvoice,
      component: <IssuanceTable />,
    },
  ];

  const handleTabChange = (value: string) => {
    router.push(`/management?tab=${value}`, { scroll: false });
  };

  return (
    <div className="p-6">
      <TabsComponent
        items={items}
        value={activeTab}
        onValueChange={handleTabChange}
      />
    </div>
  );
}

// Loading fallback component
function ManagementPageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
      </div>
    </div>
  );
}

// Wrap with Suspense
export default function ManagementPage() {
  return (
    <Suspense fallback={<ManagementPageLoading />}>
      <ManagementPageContent />
    </Suspense>
  );
}
