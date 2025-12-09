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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@syntaxsentinel/date-utils';
import { extractErrorMessage } from '@/configs/api.helper';
import { toast } from '@/components/ui/sonner';
import { GetAllAuthLogsPaginated } from '@/api/protected/auth.api';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';

interface AuthLog {
  id: string;
  idAddress: string;
  device: string;
  timestamp: string;
  user: {
    email: string;
    fullname: string;
  };
  deletedAt?: string | null;
}

export function useAuthLogsTableLogic() {
  const { user } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<() => void | null>(null);

  const handleSetRefreshFn = useCallback((refresh: () => void) => {
    setRefreshFn(() => refresh);
  }, []);

  const fetchAuthLogs = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    if (!user) {
      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
      };
    }
    try {
      const response = await GetAllAuthLogsPaginated(user.id, params);
      if (!response.auth_logs_data)
        throw new Error('Invalid response structure');
      return {
        data: response.auth_logs_data,
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

  const columns: ColumnDef<AuthLog>[] = [
    {
      accessorKey: 'id',
      header: 'Log ID',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'device',
      header: 'Device',
      cell: ({ getValue }) => (
        <span className="text-sm whitespace-pre-wrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.readableDateTime(getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'user.fullname',
      header: 'Full Name',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.user.fullname}</span>
      ),
    },
    {
      accessorKey: 'user.email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.user.email}
        </span>
      ),
    },
  ];

  const cardComponent = ({ row }: { row: AuthLog }) => {
    const log = row;
    const initials = log.user.fullname
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
              {log.user.fullname}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {log.user.email}
            </p>
          </div>
        </div>

        {/* Log Details — INCLUDING TIMESTAMP */}
        <div className="mt-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID:</span>
            <span className="font-mono truncate text-foreground">{log.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP:</span>
            <span className="font-mono truncate text-foreground">
              {log.idAddress}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Device:</span>
            <span className="max-w-[160px] truncate font-mono text-right text-foreground">
              {log.device || 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-mono text-foreground">
              {formatDate.readableDateTime(log.timestamp)}
            </span>
          </div>
        </div>

        {/* Deleted Badge */}
        {log.deletedAt && (
          <div className="mt-3 pt-2 border-t border-border">
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              Deleted: {formatDate.readableDateTime(log.deletedAt)}
            </span>
          </div>
        )}
      </>
    );
  };
  return {
    columns,
    fetchAuthLogs,
    handleSetRefreshFn,
    cardComponent,
  };
}
