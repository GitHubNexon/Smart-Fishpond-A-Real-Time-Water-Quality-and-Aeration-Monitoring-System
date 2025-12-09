'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  User,
  FileDown,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { GetAllAuditLogsPaginated, AuditLogs } from '@/api/protected/audit.api';
import { UserData } from '@/interfaces/user-api.interface';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuditDetails from './audit-details';

export function useAuditTableLogic() {
  const { user } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<() => void | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<AuditLogs | null>(null);

  const handleViewDetails = (audit: AuditLogs) => {
    setSelectedForDetails(audit);
    setDrawerOpen(true);
  };

  const handleSetRefreshFn = useCallback((refresh: () => void) => {
    setRefreshFn(() => refresh);
  }, []);

  const fetchAuditLogs = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await GetAllAuditLogsPaginated(params);
      if (!response.audit_logs) throw new Error('Invalid response structure');
      return {
        data: response.audit_logs,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      toast.error({
        title: 'Fetch Failed',
        description: extractErrorMessage(error),
      });
      console.log(extractErrorMessage(error));
      throw error;
    }
  };

  const columns: ColumnDef<AuditLogs>[] = [
    {
      accessorKey: 'id',
      header: 'Audit log ID',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'transactionId',
      header: 'Transaction ID',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'action',
      header: 'ACTION',
      cell: ({ getValue }) => (
        <span className="text-sm whitespace-pre-wrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.readableDateTime(getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'performedBy.fullname',
      header: 'Performed By',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.performedBy.fullname}</span>
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
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewDetails(data)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const cardComponent = ({ row }: { row: AuditLogs }) => {
    const log = row;
    const initials = log.performedBy.fullname
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    return (
      <>
        {/* Header: Avatar + User Info */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {log.performedBy.fullname}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {log.performedBy.email}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* User Details Preview */}
            <DropdownMenuItem onClick={() => handleViewDetails(log)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Log Details — INCLUDING TIMESTAMP */}
        <div className="mt-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono truncate text-foreground">{log.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID:</span>
            <span className="font-mono truncate text-foreground">
              {log.transactionId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Action</span>
            <span className="font-mono truncate text-foreground">
              {log.action}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title:</span>
            <span className="max-w-[160px] truncate font-mono text-right text-foreground">
              {log.title || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-mono text-foreground">
              {formatDate.readableDateTime(log.createdAt)}
            </span>
          </div>
        </div>
      </>
    );
  };

  return {
    columns,
    fetchAuditLogs,
    handleSetRefreshFn,
    cardComponent,
    refreshFn,
    setRefreshFn,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,

    renderAuditDetailsDrawer: () => (
      <AuditDetails
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        audit={selectedForDetails}
      />
    ),
  };
}
