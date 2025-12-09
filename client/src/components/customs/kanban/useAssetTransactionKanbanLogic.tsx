// Updated useAssetTransactionKanbanLogic.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PackageIcon,
  AlertCircleIcon,
  TruckIcon,
  Eye,
  ArchiveIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { AssetTransactionInfo } from '@/interfaces/asset-transaction.api.interface';
import { GetAllAssetTransactionPaginated } from '@/api/protected/assets-api/asset-transaction.api';
import { KanbanColumn } from '@/components/customs/kanban/kanban.interface';

export function useAssetTransactionKanbanLogic() {
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<AssetTransactionInfo | null>(null);

  const handleViewDetails = (transaction: AssetTransactionInfo) => {
    setSelectedForDetails(transaction);
    setDrawerOpen(true);
  };

  const handleSetRefreshFn = useCallback((refresh: () => void) => {
    setRefreshFn(() => refresh);
  }, []);

  const transactionColumns: KanbanColumn[] = [
    {
      id: 'for-issuance',
      title: 'For Issuance',
      value: 'For-Issuance',
      color: 'text-yellow-600',
      icon: <ClockIcon size={16} className="text-yellow-600" />,
    },
    {
      id: 'issued',
      title: 'Issued',
      value: 'Issued',
      color: 'text-purple-600',
      icon: <CheckCircleIcon size={16} className="text-purple-600" />,
    },
    {
      id: 'for-transfer',
      title: 'For Transfer',
      value: 'For-Transfer',
      color: 'text-blue-600',
      icon: <TruckIcon size={16} className="text-blue-600" />,
    },
    {
      id: 'transferred',
      title: 'Transferred',
      value: 'Transferred',
      color: 'text-green-600',
      icon: <CheckCircleIcon size={16} className="text-green-600" />,
    },
    {
      id: 'available',
      title: 'Available',
      value: 'Available',
      color: 'text-green-500',
      icon: <PackageIcon size={16} className="text-green-500" />,
    },
    {
      id: 'returned',
      title: 'Returned',
      value: 'Returned-To-Custodian',
      color: 'text-orange-600',
      icon: <ArchiveIcon size={16} className="text-orange-600" />,
    },
  ];

  // UPDATED: Fetch function now supports pagination params
  const fetchAssetTransaction = async (params: {
    keyword?: string;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await GetAllAssetTransactionPaginated({
        page: params.page || 1,
        limit: params.limit || 50, 
        keyword: params.keyword,
        filters: params.filters,
      });

      if (!response.asset_transaction_data) {
        throw new Error('Invalid response structure');
      }

      return {
        data: response.asset_transaction_data,
        totalItems: response.totalItems,
      };
    } catch (error) {
      showToastError(
        'Fetch failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.error(extractErrorMessage(error));
      throw error;
    }
  };

  // Handle status change
  const handleStatusChange = async (
    transaction: AssetTransactionInfo,
    newStatus: string,
  ) => {
    try {
      // Replace with your actual API call to update status
      // await UpdateAssetTransactionStatus(transaction.id, { status: newStatus });

      // For now, we'll just show a toast
      showToastSuccess(
        'Status Updated',
        `Transaction ${transaction.transactionNo} status changed to ${newStatus}`,
        'bottom-right',
      );

      // Refresh data
      refreshFn?.();
    } catch (error) {
      showToastError(
        'Update failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      throw error;
    }
  };

  const statusColors: Record<string, string> = {
    'New-Available': 'bg-blue-500 text-white',
    Available: 'bg-green-500 text-white',
    'For-Issuance': 'bg-yellow-500 text-black',
    Issued: 'bg-purple-500 text-white',
    'Returned-To-Custodian': 'bg-orange-500 text-white',
    'Returned-For-Disposal': 'bg-red-500 text-white',
    'Returned-For-Repair': 'bg-indigo-500 text-white',
    'For-Transfer': 'bg-teal-500 text-white',
    Transferred: 'bg-green-600 text-white',
    'For-Disposal': 'bg-red-400 text-white',
    'For-Repair': 'bg-blue-400 text-white',
    Repaired: 'bg-green-300 text-black',
    Lost: 'bg-gray-800 text-white',
    Stolen: 'bg-black text-white',
    Deprecated: 'bg-gray-500 text-white',
  };

  const checkboxActions = [
    {
      label: 'Approve Selected',
      variant: 'default' as const,
      icon: <CheckCircleIcon size={16} />,
      action: async (selectedItems: AssetTransactionInfo[]) => {
        try {
          // Bulk approve logic here
          console.log('Approving:', selectedItems);
          showToastSuccess(
            'Bulk Approval',
            `${selectedItems.length} transactions approved`,
            'bottom-right',
          );
          refreshFn?.();
        } catch (error) {
          showToastError(
            'Bulk approval failed',
            extractErrorMessage(error),
            'bottom-right',
          );
        }
      },
    },
    {
      label: 'Reject Selected',
      variant: 'destructive' as const,
      icon: <XCircleIcon size={16} />,
      action: async (selectedItems: AssetTransactionInfo[]) => {
        try {
          // Bulk reject logic here
          console.log('Rejecting:', selectedItems);
          showToastSuccess(
            'Bulk Rejection',
            `${selectedItems.length} transactions rejected`,
            'bottom-right',
          );
          refreshFn?.();
        } catch (error) {
          showToastError(
            'Bulk rejection failed',
            extractErrorMessage(error),
            'bottom-right',
          );
        }
      },
    },
  ];

  // Card component for rendering each transaction
  const cardComponent = ({
    item,
    index,
    isSelected,
    onSelect,
    onStatusChange,
  }: {
    item: AssetTransactionInfo;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onStatusChange: (newStatus: string | boolean) => void;
  }) => {
    return (
      <div className="space-y-2.5 w-full">
        {/* Transaction Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">
              {item.transactionNo}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {item.transactionType?.replace(/_/g, ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleViewDetails(item)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Asset Info */}
        <div className="space-y-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Asset:</span>
            <span className="text-xs font-medium break-words line-clamp-2">
              {item.inventory?.asset?.assetName || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Inventory:</span>
            <span className="text-xs font-medium truncate">
              {item.inventory?.inventoryNo || 'N/A'}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col gap-1.5">
          {item.fromStatus && (
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 w-fit ${
                statusColors[item.fromStatus] || 'bg-gray-300'
              }`}
            >
              From: {item.fromStatus}
            </Badge>
          )}
          {item.toStatus && (
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 w-fit ${
                statusColors[item.toStatus] || 'bg-gray-300'
              }`}
            >
              To: {item.toStatus}
            </Badge>
          )}
        </div>

        {/* Date and Prepared By */}
        <div className="pt-2 border-t space-y-1">
          <div className="flex justify-between items-start gap-2 text-xs">
            <span className="text-muted-foreground flex-shrink-0">Date:</span>
            <span className="font-medium text-right">
              {item.transactionDate
                ? formatDate.shortDate(item.transactionDate)
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-start gap-2 text-xs">
            <span className="text-muted-foreground flex-shrink-0">By:</span>
            <span
              className="font-medium truncate text-right max-w-[160px]"
              title={item.preparedBy?.fullname || 'N/A'}
            >
              {item.preparedBy?.fullname || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Filter options
  const filterOptions = [
    {
      key: 'transactionType',
      label: 'Transaction Type',
      multiple: true,
      options: [
        { value: 'direct_issuance', label: 'Direct Issuance' },
        { value: 'request_issuance', label: 'Request Issuance' },
        { value: 'request_transfer', label: 'Request Transfer' },
        { value: 'return_to_inventory', label: 'Return to Inventory' },
        { value: 'approve_issuance', label: 'Approve Issuance' },
        { value: 'approve_transfer', label: 'Approve Transfer' },
        { value: 'make_available', label: 'Make Available' },
      ],
    },
  ];

  return {
    transactionColumns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleStatusChange,
    cardComponent,
    checkboxActions,
    filterOptions,
    drawerOpen,
    setDrawerOpen,
    selectedForDetails,
    setSelectedForDetails,
  };
}
