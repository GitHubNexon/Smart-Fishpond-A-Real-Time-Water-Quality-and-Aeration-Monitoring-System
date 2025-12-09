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
import {
  GetAllPaginatedAssetsDepreciation,
  DepreciationInfo,
} from '@/interfaces/assets-depreciation.api.interface';
import {
  GetAllPaginatedDepreciation,
  verifyDepreciation,
} from '@/api/protected/assets-api/asset-depreciation.api';
import AssetDeprecitionFormModal from '@/modals/asset-depreciation-form-modals/asset-depreciation-form.modal';
import { getAuditLogsByTransaction } from '@/api/protected/audit.api';
import { AuditLogs } from '@/api/protected/audit.api';
import DrawerComponent from '@/components/customs/drawer.component';
import AuditLogsViewer from '@/components/customs/audit-logs-viewer';

export function useAssetDepreciationTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedDepreciation, setSelectedDepreciation] =
    useState<DepreciationInfo | null>(null);

  const [auditLogsDrawerOpen, setAuditLogsDrawerOpen] = useState(false);
  const [auditLogsData, setAuditLogsData] = useState<AuditLogs[]>([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);

  const handleViewAuditLogs = async (depreciation: DepreciationInfo) => {
    try {
      setIsLoadingAuditLogs(true);
      setAuditLogsDrawerOpen(true);
      const response = await getAuditLogsByTransaction(
        `TX_ASSET-DEPRECIATION-${depreciation.id}`,
      );
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
    useState<DepreciationInfo | null>(null);

  const handleViewDetails = (depreciation: DepreciationInfo) => {
    setSelectedForDetails(depreciation);
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
        window.location.hash === '#add-depreciation' ||
        window.location.hash === '#edit-depreciation'
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

  //fetch function

  const fetchDepreciation = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await GetAllPaginatedDepreciation(params);
      if (!response.asset_depreciation_data)
        throw new Error('Invalid response structure');

      return {
        data: response.asset_depreciation_data,
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
  const handleAddNewDepreciation = () => {
    window.location.hash = 'add-depreciation';
    setSelectedDepreciation(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditDepreciation = (depreciation: DepreciationInfo) => {
    window.location.hash = 'edit-depreciation';
    setSelectedDepreciation(depreciation);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleVerifyDepreciation = async (depreciation: DepreciationInfo) => {
    try {
      if (!depreciation) {
        showToastError('Verification Error', 'ID is missing', 'bottom-right');
      }
      const response = await verifyDepreciation(depreciation.id);
      showToastSuccess(
        'Asset Depreciation Verification',
        response.message,
        'top-right',
      );
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Asset Depreciation Verification',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  const handleCopy = (assetId: string) => {
    navigator.clipboard.writeText(assetId);
    showToastSuccess(
      'Copy ClipBoard',
      'Asset No Copy Successfully',
      'top-center',
    );
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

  const columns: ColumnDef<DepreciationInfo>[] = [
    {
      accessorKey: 'status',
      size: 120,
      header: 'Status',
      cell: ({ row }) => {
        const data = row.original;

        return (
          <Badge
            className={
              data.isVerified
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }
          >
            {data.isVerified ? 'Verified' : 'Pending'}
          </Badge>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'asset.assetNo',
      size: 200,
      header: 'Asset No',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.asset.assetNo}</span>
      ),
    },
    {
      accessorKey: 'asset.assetName',
      size: 200,
      header: 'Asset Name',
      cell: ({ row }) => (
        <span className="text-sm break-words w-10">
          {row.original.asset.assetName}
        </span>
      ),
    },
    {
      accessorKey: 'usefulLife',
      size: 100,
      header: 'Useful Life',
      cell: ({ getValue, row }) => (
        <span className="text-sm">
          {getValue() as number} {row.original.usefulLifeUnit}
        </span>
      ),
    },
    {
      accessorKey: 'salvageValue',
      size: 150,
      header: 'Salvage Value',
      cell: ({ getValue }) => (
        <span className="text-sm">
          {formatNumber.currency(getValue() as number, 'PHP')}
        </span>
      ),
    },
    {
      accessorKey: 'firstDepreciationDate',
      size: 150,
      header: 'First Depreciation',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue() ? formatDate.shortDate(getValue() as Date) : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'lastDepreciationDate',
      size: 150,
      header: 'Last Depreciation',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue() ? formatDate.shortDate(getValue() as Date) : '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      size: 60,
      header: '',
      cell: ({ row }) => {
        const data = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleViewAuditLogs(data)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(data)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {!data.isVerified && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleEditDepreciation(data)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              {!data.isVerified ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleVerifyDepreciation(data)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verify
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : (
                <DropdownMenuItem disabled>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Already Verified
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Card component for mobile / card view
  const cardComponent = ({ row }: { row: DepreciationInfo }) => {
    const cardData = row;
    const canVerify = !cardData.isVerified;

    return (
      <div className="space-y-3 p-3 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
        <div className="flex items-end justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleViewAuditLogs(cardData)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(cardData)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>

              {!cardData.isVerified && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleEditDepreciation(cardData)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              {canVerify ? (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleVerifyDepreciation(cardData)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verify
                  </DropdownMenuItem>
                </PermissionWrapper>
              ) : (
                <DropdownMenuItem disabled>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Already Verified
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Asset No</p>
          <p className="text-sm break-all">{cardData.asset.assetNo}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Asset Name</p>
          <p className="text-sm break-all">{cardData.asset.assetName}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Useful Life</p>
          <p className="text-sm">
            {cardData.usefulLife} {cardData.usefulLifeUnit}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Salvage Value</p>
          <p className="text-sm">
            {formatNumber.currency(cardData.salvageValue, 'PHP')}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            First Depreciation Date
          </p>
          <p className="text-sm">
            {cardData.firstDepreciationDate
              ? formatDate.shortDate(cardData.firstDepreciationDate)
              : '-'}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Last Depreciation Date
          </p>
          <p className="text-sm">
            {cardData.lastDepreciationDate
              ? formatDate.shortDate(cardData.lastDepreciationDate)
              : '-'}
          </p>
        </div>
      </div>
    );
  };

  return {
    columns,
    fetchDepreciation,
    handleSetRefreshFn,
    handleAddNewDepreciation,
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

    renderFormModal: () => (
      <AssetDeprecitionFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedDepreciation}
      />
    ),

    // renderAssetDetailsDrawer: () => (
    //   <AssetDetails
    //     open={drawerOpen}
    //     onOpenChange={setDrawerOpen}
    //     asset={selectedForDetails}
    //   />
    // ),
  };
}
