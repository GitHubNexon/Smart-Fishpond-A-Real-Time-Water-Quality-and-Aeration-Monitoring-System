'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/lib/format-number.util';
import { extractErrorMessage } from '@/configs/api.helper';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { AssetTransactionInfo } from '@/interfaces/asset-transaction.api.interface';
import { GetAllAssetTransactionPaginated } from '@/api/protected/assets-api/asset-transaction.api';
import TransferFormModal from '@/modals/transfer-form-modals/transfer-form';

export function useTransferTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedTransaction, setSelectedTransaction] =
    useState<AssetTransactionInfo | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<AssetTransactionInfo | null>(null);

  const handleViewDetails = (transaction: AssetTransactionInfo) => {
    setSelectedForDetails(transaction);
    setDrawerOpen(true);
  };

  const handleModalSuccess = () => {
    refreshFn?.();
  };

  const closeModal = () => {
    history.pushState(
      null,
      document.title,
      window.location.pathname + window.location.search,
    );
    setModalOpen(false);
  };

  useEffect(() => {
    const checkHash = () => {
      if (
        window.location.hash === '#add-transfer-transaction' ||
        window.location.hash === '#edit-transfer-transaction'
      ) {
        setModalOpen(true);
      } else {
        setModalOpen(false);
      }
    };

    checkHash();

    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleSetRefreshFn = useCallback((refresh: () => void) => {
    setRefreshFn(() => refresh);
  }, []);

  // Fetch function
  const fetchAssetTransaction = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) => {
    try {
      const hardcodedFilter = {
        transactionType: [
          'request_transfer', // Any → ForTransfer
          'approve_transfer', // ForTransfer → Transferred
          'reject_transfer', // ForTransfer → (back to previous status)
        ],
      };
      const finalFilters = { ...hardcodedFilter, ...params.filters };
      const response = await GetAllAssetTransactionPaginated({
        ...params,
        filters: finalFilters,
      });
      if (!response.asset_transaction_data)
        throw new Error('Invalid response structure');

      return {
        data: response.asset_transaction_data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      showToastError(
        'Fetch failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
      throw error;
    }
  };

  const handleAddTransferTransaction = () => {
    window.location.hash = '#add-transfer-transaction';
    setSelectedTransaction(null);
    setModalMode('add');
    setModalOpen(true);
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
    Transfered: 'bg-green-600 text-white',
    'For-Disposal': 'bg-red-400 text-white',
    'For-Repair': 'bg-blue-400 text-white',
    Repaired: 'bg-green-300 text-black',
    Lost: 'bg-gray-800 text-white',
    Stolen: 'bg-black text-white',
    Deprecated: 'bg-gray-500 text-white',
  };

  const checkboxActions = [
    // {
    //   label: 'Delete Items',
    //   variant: 'outline' as const,
    //   icon: <Trash2 className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkDeleteInventories,
    // },
    // {
    //   label: 'Export Selected',
    //   variant: 'outline' as const,
    //   icon: <FileDown className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkExport,
    // },
  ];

  const columns: ColumnDef<AssetTransactionInfo>[] = [
    {
      accessorKey: 'transactionNo',
      size: 200,
      header: 'Transaction No',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'custodian',
      size: 200,
      header: 'Employee',
      cell: ({ row }) => {
        const custodian = row.original.custodian;
        if (!custodian) return <span className="text-sm">N/A</span>;

        const fullName = `${custodian.firstName} ${
          custodian.middleName ? custodian.middleName + ' ' : ''
        }${custodian.lastName}`;

        return <span className="text-sm">{fullName}</span>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'transactionType',
      size: 200,
      header: 'Transaction Type',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fromStatus',
      size: 200,
      header: 'From Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const badgeClass = statusColors[status] || 'bg-gray-300 text-gray-600'; // fallback
        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'toStatus',
      size: 200,
      header: 'To Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const badgeClass = statusColors[status] || 'bg-gray-300 text-gray-600'; // fallback
        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'inventory.inventoryNo',
      size: 200,
      header: 'Inventory No',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'inventory.asset.assetName',
      size: 200,
      header: 'Asset name',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'transactionDate',
      size: 150,
      header: 'Transaction Date',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.shortDate(getValue() as string)}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'preparedBy.fullname',
      size: 200,
      header: 'Prepared By',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      size: 60,
      header: '',
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetails(rowData)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const cardComponent = ({ row }: { row: any }) => {
    const cardData = row;

    return (
      <div className="space-y-3">
        <div className="flex items-end justify-center">
          <div className="flex items-center gap-2 bg-amber-50 border border-indigo-200 text-indigo-800 px-4 py-2 rounded-xl shadow-sm">
            <Monitor className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-medium">
              Use <span className="font-semibold">desktop view</span> to access
              full details.
            </span>
          </div>
        </div>
      </div>
    );
  };

  return {
    columns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleAddTransferTransaction,
    // handleCopy,
    cardComponent,
    checkboxActions,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,

    renderTransferFormModal: () => (
      <TransferFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={[selectedTransaction]}
      />
    ),

    // renderInventoryDetailsDrawer: () => (
    //   <AssetInventoryDetails
    //     open={drawerOpen}
    //     onOpenChange={setDrawerOpen}
    //     inventory={selectedForDetails}
    //   />
    // ),
  };
}
