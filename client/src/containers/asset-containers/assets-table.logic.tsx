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
  CheckCircle2,
  ThumbsUp,
  Logs,
  Tag,
  FileText,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/lib/format-number.util';
import { extractErrorMessage } from '@/configs/api.helper';
import PermissionWrapper from '@/components/customs/permission-wrapper';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { AssetsInfo } from '@/interfaces/assets.interface';
import AssetBaseFormModal from '@/modals/asset-base-form-modals/asset-base-form.modal';
import AssetDetails from './asset-details';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import {
  finalizeAsset,
  verifyAsset,
  approveAsset,
  GetAllAssetsPaginated,
} from '@/api/protected/assets-api/asset.api';

import { getAuditLogsByTransaction } from '@/api/protected/audit.api';
import { AuditLogs } from '@/api/protected/audit.api';
import DrawerComponent from '@/components/customs/drawer.component';
import AuditLogsViewer from '@/components/customs/audit-logs-viewer';

export function useAssetTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAsset, setSelectedAsset] = useState<AssetsInfo | null>(null);

  const [auditLogsDrawerOpen, setAuditLogsDrawerOpen] = useState(false);
  const [auditLogsData, setAuditLogsData] = useState<AuditLogs[]>([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);

  const handleViewAuditLogs = async (asset: AssetsInfo) => {
    try {
      setIsLoadingAuditLogs(true);
      setAuditLogsDrawerOpen(true);
      const response = await getAuditLogsByTransaction(`TX_ASSET-${asset.id}`);
      // Assuming response contains an array of audit logs
      // Adjust based on your actual API response structure
      if (response && response.data) {
        setAuditLogsData(response.data);
      } else if (Array.isArray(response)) {
        setAuditLogsData(response);
      } else {
        setAuditLogsData([]);
      }
    } catch (error: unknown) {
      showToastError(
        'Operation Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      setAuditLogsData([]);
    } finally {
      setIsLoadingAuditLogs(false);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<AssetsInfo | null>(null);

  const handleViewDetails = (asset: AssetsInfo) => {
    setSelectedForDetails(asset);
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
        window.location.hash === '#add-asset' ||
        window.location.hash === '#edit-asset'
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
  const fetchAsset = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) => {
    try {
      const response = await GetAllAssetsPaginated(params);
      if (!response.asset_data) throw new Error('Invalid response structure');

      return {
        data: response.asset_data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      showToastError(
        'Fetch Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
      throw error;
    }
  };

  // Action Handlers
  const handleAddNewAsset = () => {
    window.location.hash = 'add-asset';
    setSelectedAsset(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditAsset = (asset: AssetsInfo) => {
    window.location.hash = 'edit-asset';
    setSelectedAsset(asset);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCopy = (assetId: string) => {
    navigator.clipboard.writeText(assetId);
    showToastSuccess(
      'Copy ClipBoard',
      'Asset No Copy Successfully',
      'top-center',
    );
  };

  const handleAssetFinalization = async (asset: AssetsInfo) => {
    try {
      if (!asset) {
        showToastError('Finalization Error', 'ID is missing', 'bottom-right');
      }
      const response = await finalizeAsset(asset.id);
      showToastSuccess('Asset Finalization', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Asset Finalization',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  const handleAssetVerification = async (asset: AssetsInfo) => {
    try {
      if (!asset) {
        showToastError('Verification Error', 'ID is missing', 'bottom-right');
      }
      const response = await verifyAsset(asset.id);
      showToastSuccess('Asset Verification', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Asset Verification',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  const handleAssetApproval = async (asset: AssetsInfo) => {
    try {
      if (!asset) {
        showToastError('Approval Error', 'ID is missing', 'bottom-right');
      }
      const response = await approveAsset(asset.id);
      showToastSuccess('Asset Approval', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Asset Approval',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  const checkboxActions = [
    // {
    //   label: 'Verify of Employees',
    //   variant: 'outline' as const,
    //   icon: <Trash2 className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkVerification,
    // },
    // {
    //   label: 'Export Selected',
    //   variant: 'outline' as const,
    //   icon: <FileDown className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkExport,
    // },
  ];

  const columns: ColumnDef<AssetsInfo>[] = [
    // {
    //   id: 'select',
    //   size: 40,
    //   header: ({ table }) => {
    //     const selectableRows = table
    //       .getRowModel()
    //       .rows.filter(
    //         (row) => !row.original.isVerified && !row.original.deletedAt,
    //       );

    //     const allSelected = selectableRows.every((row) => row.getIsSelected());
    //     const someSelected = selectableRows.some((row) => row.getIsSelected());

    //     let checkedState: true | false | 'indeterminate' = false;
    //     if (allSelected) checkedState = true;
    //     else if (someSelected) checkedState = 'indeterminate';

    //     return (
    //       <Checkbox
    //         checked={checkedState}
    //         onCheckedChange={(value) => {
    //           selectableRows.forEach((row) => row.toggleSelected(!!value));
    //         }}
    //         aria-label="Select all"
    //       />
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const isVerified = row.original.isVerified;
    //     const isDeleted = row.original.deletedAt !== null;

    //     if (isVerified || isDeleted) return null;

    //     return (
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'status',
      size: 100,
      header: 'Status',
      cell: ({ row }) => {
        const data = row.original as {
          isVerified: boolean;
          isApproved: boolean;
          isDraft: boolean;
        };

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-pointer bg-indigo-500 dark:bg-indigo-800 text-white">
                  Status
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col gap-1 bg-indigo-500 dark:bg-indigo-800">
                <Badge
                  className={
                    data.isVerified
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }
                >
                  Verified
                </Badge>
                <Badge
                  className={
                    data.isApproved
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }
                >
                  Approved
                </Badge>
                <Badge
                  className={
                    data.isDraft
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }
                >
                  Draft
                </Badge>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'assetNo',
      size: 200,
      header: 'Asset No',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'assetName',
      size: 200,
      header: 'Asset Name',
      cell: ({ getValue }) => (
        <span className="text-sm break-words w-10">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'assetDescription',
      size: 200,
      header: 'Asset Description',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      id: 'assetValue',
      size: 150,
      header: 'Asset Value',
      cell: ({ row }) => {
        const asset = row.original;
        const value =
          (asset.acquisitionCost || 0) * (asset.currentQuantity || 0);
        return (
          <span className="text-sm font-medium">
            {formatNumber.currency(value, 'PHP')}
          </span>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'acquisitionCost',
      size: 200,
      header: 'Acquisition Cost',
      cell: ({ getValue }) => (
        <span className="text-sm">
          {formatNumber.currency(getValue() as number, 'PHP')}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'currentQuantity',
      size: 100,
      header: 'Current Quantity',
      cell: ({ getValue }) => (
        <span className="text-sm">
          {formatNumber.quantity(getValue() as number, 'pcs')}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'acquisitionDate',
      size: 150,
      header: 'Acqusition Date',
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
        // Determine action states
        const canFinalize = rowData.isDraft;
        const canVerify = !rowData.isDraft && !rowData.isVerified;
        const canApprove =
          !rowData.isDraft && rowData.isVerified && !rowData.isApproved;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleCopy(rowData.assetNo)}>
                Copy Asset No
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewAuditLogs(rowData)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(rowData)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {rowData.isDraft && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem onClick={() => handleEditAsset(rowData)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              {/* Finalize Asset */}
              {canFinalize ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleAssetFinalization(rowData)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Finalize Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : (
                <DropdownMenuItem disabled>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Already Finalized
                </DropdownMenuItem>
              )}

              {/* Verify Asset */}
              {canVerify ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleAssetVerification(rowData)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verify Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : rowData.isVerified ? (
                <DropdownMenuItem disabled>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Already Verified
                </DropdownMenuItem>
              ) : null}

              {/* Approve Asset */}
              {canApprove ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleAssetApproval(rowData)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" /> Approve Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : rowData.isApproved ? (
                <DropdownMenuItem disabled>
                  <ThumbsUp className="mr-2 h-4 w-4" /> Already Approved
                </DropdownMenuItem>
              ) : null}
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

    const canFinalize = cardData.isDraft;
    const canVerify = !cardData.isDraft && !cardData.isVerified;
    const canApprove =
      !cardData.isDraft && cardData.isVerified && !cardData.isApproved;

    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start pb-2">
          <div>
            <h3 className="text-sm">{cardData.assetName}</h3>
            <p className="text-xs text-muted-foreground">{cardData.assetNo}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleCopy(cardData.assetNo)}>
                Copy Asset No
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewAuditLogs(cardData)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(cardData)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>

              {cardData.isDraft && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem onClick={() => handleEditAsset(cardData)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              <DropdownMenuSeparator />

              {cardData.isDraft ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleAssetFinalization(cardData)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Finalize Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : (
                <DropdownMenuItem disabled>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Already Finalized
                </DropdownMenuItem>
              )}

              {!cardData.isDraft && !cardData.isVerified ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleAssetVerification(cardData)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verify Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : cardData.isVerified ? (
                <DropdownMenuItem disabled>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Already Verified
                </DropdownMenuItem>
              ) : null}

              {!cardData.isDraft &&
              cardData.isVerified &&
              !cardData.isApproved ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleAssetApproval(cardData)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" /> Approve Asset
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : cardData.isApproved ? (
                <DropdownMenuItem disabled>
                  <ThumbsUp className="mr-2 h-4 w-4" /> Already Approved
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm flex-1">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>
              Acquisition Cost:{' '}
              {formatNumber.currency(cardData.acquisitionCost as number, 'PHP')}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-muted-foreground">Description</span>
              <p className="text-sm break-words">{cardData.assetDescription}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cardData.isDraft && <Badge variant="secondary">Draft</Badge>}
            {!cardData.isDraft && !cardData.isVerified && (
              <Badge variant="outline">Pending Verification</Badge>
            )}
            {cardData.isVerified && !cardData.isApproved && (
              <Badge variant="outline">Verified</Badge>
            )}
            {cardData.isApproved && <Badge variant="default">Approved</Badge>}
          </div>
        </div>
      </div>
    );
  };

  return {
    columns,
    fetchAsset,
    handleSetRefreshFn,
    handleAddNewAsset,
    handleCopy,
    cardComponent,
    checkboxActions,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,

    auditLogsDrawerOpen,
    setAuditLogsDrawerOpen,
    auditLogsData,
    isLoadingAuditLogs,

    renderAuditLogsViewer: () => (
      <DrawerComponent
        open={auditLogsDrawerOpen}
        onOpenChange={setAuditLogsDrawerOpen}
        title="Audit Logs"
        description="View user audit history"
        direction="bottom"
      >
        <AuditLogsViewer
          auditLogs={auditLogsData}
          isLoading={isLoadingAuditLogs}
        />
      </DrawerComponent>
    ),

    renderAssetBaseFormModal: () => (
      <AssetBaseFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedAsset}
      />
    ),

    renderAssetDetailsDrawer: () => (
      <AssetDetails
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        asset={selectedForDetails}
      />
    ),
  };
}
