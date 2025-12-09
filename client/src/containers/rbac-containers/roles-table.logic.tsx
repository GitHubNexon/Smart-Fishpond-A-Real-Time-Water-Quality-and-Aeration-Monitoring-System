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
  getAllRolesPaginated,
  softDeleteRole,
  RecoverRole,
} from '@/api/protected/rbac.api';
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
import { Roles } from '@/interfaces/rbac-api.interface';
import { extractErrorMessage } from '@/configs/api.helper';
import RoleFormModal from '@/modals/role-form-modals/role-form.modal';
import PermissionWrapper from '@/components/customs/permission-wrapper';

export function useRolesTableLogic() {
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<() => void | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRole, setSelectedRole] = useState<Roles | null>(null);

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
        window.location.hash === '#add-role' ||
        window.location.hash === '#edit-role'
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

  // fetch roles
  const fetchRoles = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await getAllRolesPaginated(params);
      if (!response.roles_data) throw new Error('Invalid response structure');
      return {
        data: response.roles_data,
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

  //Action handlers

  const handleAddNewRole = () => {
    window.location.hash = 'add-role';
    setSelectedRole(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditRole = (roles: Roles) => {
    window.location.hash = 'edit-role';
    setSelectedRole(roles);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteRole = async (roles: Roles) => {
    try {
      const response = await softDeleteRole(roles.id);
      showToastSuccess('Delete Role', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Deleting Role',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleRecoverRole = async (roles: Roles) => {
    try {
      const response = await RecoverRole(roles.id);
      showToastSuccess('Recover Role', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Recover Role',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleBulkDelete = (roles: Roles[]) => {};

  const handleBulkExport = (roles: Roles[]) => {};

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
      'Role ID Copy Successfully',
      'top-center',
    );
  };

  const columns: ColumnDef<Roles>[] = [
    /*
    {
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
      accessorKey: 'role',
      size: 200,
      header: 'Role',
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
    {
      id: 'actions',
      size: 60,
      header: '',
      cell: ({ row }) => {
        const role = row.original;
        const protectedRoles = [
          'Administrator',
          'User',
          'Moderator',
          'Student',
          'Professor',
          'Instructor',
          'Teacher',
          'School-Administrator',
        ];
        const isProtected = protectedRoles.includes(role.role);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCopy(role.id)}>
                Copy role ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Only show edit/delete if NOT protected */}
              {!isProtected && (
                <>
                  <PermissionWrapper permission="Update">
                    <DropdownMenuItem onClick={() => handleEditRole(role)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit role
                    </DropdownMenuItem>
                  </PermissionWrapper>

                  {role.deletedAt === null ? (
                    <PermissionWrapper permission="Delete">
                      <DropdownMenuItem
                        onClick={() => handleDeleteRole(role)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete role
                      </DropdownMenuItem>
                    </PermissionWrapper>
                  ) : null}
                </>
              )}

              {/* Recover option always allowed IF deleted */}
              {role.deletedAt !== null && (
                <DropdownMenuItem
                  onClick={() => handleRecoverRole(role)}
                  className="text-success"
                >
                  <Shield className="mr-2 h-4 w-4" /> Recover role
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

  const cardComponent = ({ row }: { row: Roles }) => {
    const role = row;
    const initials = role.role
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    const protectedRoles = [
      'Administrator',
      'User',
      'Moderator',
      'Student',
      'Professor',
      'Instructor',
      'Teacher',
      'School-Administrator',
    ];
    const isProtected = protectedRoles.includes(role.role);

    return (
      <div className="space-y-3">
        {/* Header with Icon/Avatar and Role name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <AvatarFallback className="text-sm font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-semibold text-base">{role.role}</span>
              <span className="text-sm text-muted-foreground">
                Role ID: {role.id}
              </span>
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCopy(role.id)}>
                Copy role ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isProtected && (
                <>
                  <PermissionWrapper permission="Update">
                    <DropdownMenuItem onClick={() => handleEditRole(role)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit role
                    </DropdownMenuItem>
                  </PermissionWrapper>

                  {role.deletedAt === null ? (
                    <PermissionWrapper permission="Delete">
                      <DropdownMenuItem
                        onClick={() => handleDeleteRole(role)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete role
                      </DropdownMenuItem>
                    </PermissionWrapper>
                  ) : null}
                </>
              )}

              {/* Recover option always allowed IF deleted */}
              {role.deletedAt !== null && (
                <DropdownMenuItem
                  onClick={() => handleRecoverRole(role)}
                  className="text-success"
                >
                  <Shield className="mr-2 h-4 w-4" /> Recover role
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Description</p>
          <p className="text-sm break-words">
            {role.description || 'No description'}
          </p>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{formatDate.shortDate(role.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p>{formatDate.shortDate(role.updatedAt)}</p>
          </div>
        </div>

        {/* Deleted Status */}
        {role.deletedAt && (
          <div className="pt-2 border-t">
            <Badge variant="destructive" className="text-xs">
              Deleted: {formatDate.shortDate(role.deletedAt)}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return {
    columns,
    fetchRoles,
    handleSetRefreshFn,
    handleAddNewRole,
    checkboxActions,
    cardComponent,

    renderRoleFormModal: () => (
      <RoleFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedRole}
      />
    ),
  };
}
