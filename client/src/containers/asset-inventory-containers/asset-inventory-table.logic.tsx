'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  User,
  FileDown,
  ShieldCheck,
  Eye,
  Check,
  Monitor,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/lib/format-number.util';
import { extractErrorMessage } from '@/configs/api.helper';
import PermissionWrapper from '@/components/customs/permission-wrapper';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { AssetInventoryInfo } from '@/interfaces/assets.interface';
import {
  GetAllAssetInventoryPaginated,
  removeInventoryItem,
  bulkRemoveInventoryItems,
} from '@/api/protected/assets-api/asset-inventory-api';
import AssetInventoryFormModal from '@/modals/asset-inventory-form-modals/asset-inventory-form.modal';
import AssetInventoryDetails from './asset-inventory-details';

export function useAssetInventoryTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedInventory, setSelectedInventory] =
    useState<AssetInventoryInfo | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<AssetInventoryInfo | null>(null);

  const handleViewDetails = (inventory: AssetInventoryInfo) => {
    setSelectedForDetails(inventory);
    setDrawerOpen(true);
  };

  // Function to handle modal success (refresh data after add/edit)
  const handleModalSuccess = () => {
    refreshFn?.();
  };

  // Function to close modal
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
        window.location.hash === '#add-asset-inventory' ||
        window.location.hash === '#edit-asset-inventory'
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
  const fetchAssetInventory = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await GetAllAssetInventoryPaginated(params);
      if (!response.asset_inventory_data)
        throw new Error('Invalid response structure');

      return {
        data: response.asset_inventory_data,
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

  // Action Handlers
  const handleAddNewAsset = () => {
    window.location.hash = 'add-asset-inventory';
    setSelectedInventory(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditAsset = (inventory: AssetInventoryInfo) => {
    window.location.hash = 'edit-asset-inventory';
    setSelectedInventory(inventory);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteInventory = async (inv: AssetInventoryInfo) => {
    try {
      const response = await removeInventoryItem(inv.id);
      showToastSuccess('Deleted Inventory', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Deleting',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  const handleBulkDeleteInventories = async (invs: AssetInventoryInfo[]) => {
    try {
      if (!invs || invs.length < 2) {
        showToastError(
          'Bulk Deletion Error',
          'Please Select at least 2 inventory item for deletion',
          'top-center',
        );
        return;
      }
      const ids = invs.map((inv) => inv.id);
      const response = await bulkRemoveInventoryItems(ids);
      showToastSuccess(
        'Bulk Deletion Inventory Item',
        response.message,
        'top-right',
      );
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Bulk Deletion Inventory Items',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  const handleCopy = (inventoryNo: string) => {
    navigator.clipboard.writeText(inventoryNo);
    showToastSuccess(
      'Copy Clipboard',
      'Inventory No Copy Succesfully',
      'top-center',
    );
  };

  const checkboxActions = [
    {
      label: 'Delete Items',
      variant: 'outline' as const,
      icon: <Trash2 className="-ms-1 opacity-60" size={16} />,
      action: handleBulkDeleteInventories,
    },
    // {
    //   label: 'Export Selected',
    //   variant: 'outline' as const,
    //   icon: <FileDown className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkExport,
    // },
  ];

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

  const columns: ColumnDef<AssetInventoryInfo>[] = [
    {
      id: 'select',
      size: 40,
      header: ({ table }) => {
        const selectableRows = table
          .getRowModel()
          .rows.filter((row) => row.original.isDraft);

        const allSelected = selectableRows.every((row) => row.getIsSelected());
        const someSelected = selectableRows.some((row) => row.getIsSelected());

        let checkedState: true | false | 'indeterminate' = false;
        if (allSelected) checkedState = true;
        else if (someSelected) checkedState = 'indeterminate';

        return (
          <Checkbox
            checked={checkedState}
            onCheckedChange={(value) => {
              selectableRows.forEach((row) => row.toggleSelected(!!value));
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const isDraft = row.original.isDraft;

        // Only show checkbox if it's a draft (still editable)
        if (!isDraft) return null;

        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      size: 200,
      header: 'Asset Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const badgeClass = statusColors[status] || 'bg-gray-300 text-gray-600'; // fallback
        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'isDraft',
      size: 100,
      header: 'Verification Status',
      cell: ({ row }) => {
        const data = row.original as {
          isDraft: boolean;
        };

        return (
          <Badge
            className={
              data.isDraft
                ? 'bg-gray-300 text-gray-600' // Draft
                : 'bg-green-500 text-white' // Verified
            }
          >
            {data.isDraft ? 'Draft' : 'Verified'}
          </Badge>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'asset.assetName',
      size: 200,
      header: 'Asset name',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'inventoryNo',
      size: 200,
      header: 'Inventory No',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'custodian', // point to the whole object
      size: 200,
      header: 'Custodian',
      cell: ({ row }) => {
        const custodian = row.original.custodian;
        if (!custodian) return 'N/A';

        const fullName = `${custodian.firstName} ${
          custodian.middleName ? custodian.middleName + ' ' : ''
        }${custodian.lastName}`;
        return <span className="text-sm">{fullName}</span>;
      },
    },
    {
      accessorKey: 'location',
      size: 200,
      header: 'location',
      cell: ({ getValue }) => (
        <span className="text-sm break-words w-10">
          {(getValue() as string) || 'No Location'}{' '}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      size: 150,
      header: 'Created At',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.shortDate(getValue() as string)}
        </span>
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

              <DropdownMenuItem onClick={() => handleCopy(rowData.inventoryNo)}>
                Copy Inventory No
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewDetails(rowData)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {rowData?.isDraft && authUser?.id !== rowData?.id && (
                <PermissionWrapper permission="Delete">
                  <DropdownMenuItem
                    onClick={() => handleDeleteInventory(rowData)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Item
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              {/* <PermissionWrapper permission="Update">
                <DropdownMenuItem onClick={() => handleEditAsset(rowData)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Asset
                </DropdownMenuItem>
              </PermissionWrapper> */}
              {/* 
     

              {/* {rowData.deletedAt === null ? (
                authUser.id !== rowData.id && (
                  <PermissionWrapper permission="Delete">
                    <DropdownMenuItem
                      onClick={() => handleDeleteEmployee(rowData)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
                    </DropdownMenuItem>
                  </PermissionWrapper>
                )
              ) : (
                <DropdownMenuItem
                  onClick={() => handleRecoverEmployee(rowData)}
                  className="text-success"
                >
                  <Shield className="mr-2 h-4 w-4" /> Recover Employee
                </DropdownMenuItem>
              )} */}
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
    fetchAssetInventory,
    handleSetRefreshFn,
    handleAddNewAsset,
    handleCopy,
    cardComponent,
    checkboxActions,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,

    renderInventoryFormModal: () => (
      <AssetInventoryFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={[selectedInventory]}
      />
    ),

    renderInventoryDetailsDrawer: () => (
      <AssetInventoryDetails
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        inventory={selectedForDetails}
      />
    ),
  };
}
