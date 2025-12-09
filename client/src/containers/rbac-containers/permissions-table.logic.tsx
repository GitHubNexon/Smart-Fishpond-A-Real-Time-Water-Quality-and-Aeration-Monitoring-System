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
} from 'lucide-react';
import {
  getAllPermissionPaginated,
  softDeletePermission,
  RecoverPermission,
} from '@/api/protected/rbac.api';
import { AuthCheck } from '@/api/protected/auth.api';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
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
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { Permissions } from '@/interfaces/rbac-api.interface';
import { extractErrorMessage } from '@/configs/api.helper';
import PermissionFormModal from '@/modals/permission-form-modals/permission-form.modal';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';

export function usePermissionTableLogic() {
  const CheckUser = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<() => void | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPermission, setSelectedPermission] =
    useState<Permissions | null>(null);

  //function to check if it's the system admin
  const checkAdmin = () => {
    return CheckUser.user?.email === 'admin@email.com';
  };

  // Function to handle modal success (refresh data after add/edit)
  const handleModalSuccess = () => {
    refreshFn?.();
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    history.pushState(
      null,
      document.title,
      window.location.pathname + window.location.search,
    );
  };

  useEffect(() => {
    const checkHash = () => {
      if (
        window.location.hash === '#add-permission' ||
        window.location.hash === '#edit-permission'
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

  //fetch
  const fetchPermissions = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await getAllPermissionPaginated(params);
      if (!response.permission_data)
        throw new Error('Invalid response structure');
      return {
        data: response.permission_data,
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

  const handleAddNewPermission = () => {
    window.location.hash = 'add-permission';
    setSelectedPermission(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditPermission = (permissions: Permissions) => {
    window.location.hash = 'edit-permission';
    setSelectedPermission(permissions);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeletePermission = async (permissions: Permissions) => {
    try {
      const response = await softDeletePermission(permissions.id);
      showToastSuccess('Delete Permission', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Deleting Permission',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };
  const handleRecoverPermission = async (permissions: Permissions) => {
    try {
      const response = await RecoverPermission(permissions.id);
      showToastSuccess('Recover Permisison', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Recover Permission',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleBulkDelete = (permissions: Permissions[]) => {};

  const handleBulkExport = (permissions: Permissions[]) => {};

  const checkboxActions = [
    {
      label: 'Delete Selected',
      variant: 'destructive' as const,
      icon: <Trash2 className="-ms-1 opacity-60" size={16} />,
      action: handleBulkDelete,
    },
    {
      label: 'Export Selected',
      variant: 'outline' as const,
      icon: <FileDown className="-ms-1 opacity-60" size={16} />,
      action: handleBulkExport,
    },
  ];

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    showToastSuccess(
      'Copy ClipBoard',
      'Permission ID Copy Succesfully',
      'top-center',
    );
  };

  const columns: ColumnDef<Permissions>[] = [
    /*
    checkAdmin() && {
      id: 'select',
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    */
    {
      accessorKey: 'permission',
      size: 200,
      header: 'Permission',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'description',
      size: 200,
      header: 'Desctiption',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      size: 100,
      header: 'Created at',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.shortDate(getValue() as string)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'updatedAt',
      size: 100,
      header: 'Updated at',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.readableDateTime(getValue() as string)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'deletedAt',
      size: 100,
      header: 'Deleted at',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue()
            ? formatDate.readableDateTime(getValue() as string)
            : 'N/A'}
        </span>
      ),
      enableSorting: false,
    },
    checkAdmin() && {
      id: 'actions',
      size: 60,
      header: '',
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCopy(permission.id)}>
                Copy permission ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* <DropdownMenuItem
                onClick={() => handleEditPermission(permission)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit permission
              </DropdownMenuItem>
              {permission.deletedAt === null ? (
                <DropdownMenuItem
                  onClick={() => handleDeletePermission(permission)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete permission
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleRecoverPermission(permission)}
                  className="text-success"
                >
                  <Shield className="mr-2 h-4 w-4" /> Recover permission
                </DropdownMenuItem>
              )} */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ].filter(Boolean);

  const cardComponent = ({ row }: { row: Permissions }) => {
    const permission = row;
    const initials = permission.permission
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    return (
      <div className="space-y-3">
        {/* Header with Icon/Avatar and Permission name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <AvatarFallback className="text-sm font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Actions dropdown */}
          {checkAdmin() && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleCopy(permission.id)}>
                  Copy permission ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem
                  onClick={() => handleEditPermission(permission)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit permission
                </DropdownMenuItem>
                {permission.deletedAt === null ? (
                  <DropdownMenuItem
                    onClick={() => handleDeletePermission(permission)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete permission
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleRecoverPermission(permission)}
                    className="text-success"
                  >
                    <Shield className="mr-2 h-4 w-4" /> Recover permission
                  </DropdownMenuItem>
                )} */}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Description</p>
          <p className="text-sm break-words">
            {permission.description || 'No description'}
          </p>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{formatDate.shortDate(permission.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p>{formatDate.shortDate(permission.updatedAt)}</p>
          </div>
        </div>

        {/* Deleted Status */}
        {permission.deletedAt && (
          <div className="pt-2 border-t">
            <Badge variant="destructive" className="text-xs">
              Deleted: {formatDate.shortDate(permission.deletedAt)}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return {
    columns,
    fetchPermissions,
    handleSetRefreshFn,
    handleAddNewPermission,
    checkboxActions,
    cardComponent,

    renderPermissionFormModal: () => (
      <PermissionFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedPermission}
      />
    ),
  };
}
