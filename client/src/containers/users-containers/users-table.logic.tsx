// src/components/customs/users/users-table.logic.tsx

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
  GetAllUserPaginated,
  softDeleteUser,
  RecoverUser,
} from '@/api/protected/user.api';
import { UnlockAccount } from '@/api/protected/auth.api';
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
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import UserFormModal from '@/modals/user-form-modals/user-form-modal';
import { extractErrorMessage } from '@/configs/api.helper';
import PermissionWrapper from '@/components/customs/permission-wrapper';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import UserDetails from './user.details';
import { Eye, Logs } from 'lucide-react';
import { getAuditLogsByTransaction } from '@/api/protected/audit.api';
import { AuditLogs } from '@/api/protected/audit.api';
import DrawerComponent from '@/components/customs/drawer.component';
import AuditLogsViewer from '@/components/customs/audit-logs-viewer';

// Types
export interface User {
  id: string;
  fullname: string;
  profileImage: string;
  username: string;
  email: string;
  roleId: {
    id: string;
    role: string;
    description: string;
  };
  userPermissions: any;
  failedAttempts: number;
  lockoutUntil: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
  access: string[];
}

export interface UsersApiResponse {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  users_data: User[];
}

// Hooks for Users Table Logic
export function useUsersTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [auditLogsDrawerOpen, setAuditLogsDrawerOpen] = useState(false);
  const [auditLogsData, setAuditLogsData] = useState<AuditLogs[]>([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);

  //new states for user details
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] =
    useState<User | null>(null);

  const handleViewDetails = (user: User) => {
    setSelectedUserForDetails(user);
    setDrawerOpen(true);
  };

  const handleViewAuditLogs = async (user: User) => {
    try {
      setIsLoadingAuditLogs(true);
      setAuditLogsDrawerOpen(true);
      const response = await getAuditLogsByTransaction(`TX_USER-${user.id}`);
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
        window.location.hash === '#add-user' ||
        window.location.hash === '#edit-user'
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
  const fetchUsers = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await GetAllUserPaginated(params);
      if (!response.users_data) throw new Error('Invalid response structure');

      return {
        data: response.users_data,
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

  const handleUnlockAccount = async (user: User) => {
    try {
      const response = await UnlockAccount(user.email);
      showToastSuccess(
        'Account Unlocked',
        response.message || `${user.fullname}'s account has been unlocked.`,
        'top-right',
      );
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Unlock Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  // Action Handlers
  const handleAddNewUser = () => {
    window.location.hash = 'add-user';
    setSelectedUser(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    window.location.hash = 'edit-user';
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      const response = await softDeleteUser(user.id);
      showToastSuccess('Delete User', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Deleting User',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleRecoverUser = async (user: User) => {
    try {
      const response = await RecoverUser(user.id);
      showToastSuccess('Recover User', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Recover User',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleBulkDelete = (users: User[]) => {};

  const handleBulkExport = (users: User[]) => {};

  // Bulk Checkbox Actions
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
      'User ID Copy Successfully',
      'top-center',
    );
  };

  // Column Definitions
  const columns: ColumnDef<User>[] = [
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
      accessorKey: 'fullname',
      size: 250,
      header: 'User',
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.fullname
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {user.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.fullname} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.fullname}</span>
              <span className="text-xs text-muted-foreground">
                {user.username}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      size: 300,
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      enableSorting: false,
      enableHiding: false,
      accessorKey: 'roleId.role',
      size: 200,
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.roleId.role;
        const isAdmin = role.toLowerCase() === 'administrator';

        return (
          <Badge variant={isAdmin ? 'default' : 'secondary'} className="gap-1">
            {isAdmin ? (
              <Shield className="h-3 w-3" />
            ) : (
              <User className="h-3 w-3" />
            )}
            {role}
          </Badge>
        );
      },
    },
    {
      id: 'permissions',
      size: 200,
      header: 'Permissions',
      cell: ({ row }) => {
        const userPermissions = row.original.userPermissions || [];

        const hasPermissions = userPermissions.length > 0;
        const permissionCount = userPermissions.length;

        const permissionList = userPermissions.map(
          (perm) => perm.permission?.permission,
        );

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={hasPermissions ? 'outline' : 'secondary'}
                  className="cursor-default p-2"
                >
                  {hasPermissions
                    ? `${permissionCount} Permission${
                        permissionCount > 1 ? 's' : ''
                      }`
                    : 'No Permissions Assigned'}
                </Badge>
              </TooltipTrigger>
              {hasPermissions && (
                <TooltipContent side="top" className="text-sm space-y-1">
                  <p className="font-semibold mb-1">User Permissions</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {permissionList.map((perm) => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'failedAttempts',
      size: 100,
      header: 'Failed Attempts',
      cell: ({ getValue }) => {
        const attempts = getValue() as number;
        return (
          <Badge variant={attempts > 0 ? 'destructive' : 'outline'}>
            {attempts}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      size: 150,
      header: 'Created at',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.shortDate(getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      size: 150,
      header: 'Updated at',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate.readableDateTime(getValue() as string)}
        </span>
      ),
    },
    {
      accessorKey: 'deletedAt',
      size: 150,
      header: 'Deleted at',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {getValue()
            ? formatDate.readableDateTime(getValue() as string)
            : 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'version',
      size: 100,
      header: 'Version',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
      enableSorting: false,
    },
    {
      id: 'accountStatus',
      size: 200,
      header: 'Account Status',
      cell: ({ row }) => {
        const user = row.original;
        const locked =
          user.lockoutUntil && new Date(user.lockoutUntil) > new Date();

        if (user.deletedAt) {
          return (
            <Badge
              variant="destructive"
              className="flex flex-col items-start py-2 text-left whitespace-normal"
            >
              <span className="font-medium">Deactivated</span>
              <span className="text-xs opacity-90">
                {formatDate.readableDateTime(user.deletedAt)}
              </span>
            </Badge>
          );
        }

        if (locked) {
          return (
            <Badge
              variant="destructive"
              className="flex flex-col items-start py-2 text-left whitespace-normal"
            >
              <span className="font-medium">Account Locked until</span>
              <span className="text-xs opacity-90">
                {formatDate.readableDateTime(user.lockoutUntil!)}
              </span>
            </Badge>
          );
        }

        return (
          <Badge
            variant="outline"
            className="flex flex-col items-start py-2 text-left whitespace-normal"
          >
            <span className="font-medium">Active</span>
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      size: 60,
      header: '',
      cell: ({ row }) => {
        const rowUser = row.original;
        const adminEmail = 'admin@email.com';
        if (
          rowUser.email?.trim().toLowerCase() === adminEmail &&
          authUser?.email?.trim().toLowerCase() !== adminEmail
        ) {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleCopy(rowUser.id)}>
                Copy user ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* User Details Preview */}

              <DropdownMenuItem onClick={() => handleViewAuditLogs(rowUser)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(rowUser)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>

              {rowUser.lockoutUntil &&
                new Date(rowUser.lockoutUntil) > new Date() && (
                  <DropdownMenuItem
                    onClick={() => handleUnlockAccount(rowUser)}
                    className="text-success"
                  >
                    <Shield className="mr-2 h-4 w-4" /> Unlock Account
                  </DropdownMenuItem>
                )}

              <PermissionWrapper permission="Update">
                <DropdownMenuItem onClick={() => handleEditUser(rowUser)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit user
                </DropdownMenuItem>
              </PermissionWrapper>

              {rowUser.deletedAt === null ? (
                authUser?.id !== rowUser.id && (
                  <PermissionWrapper permission="Delete">
                    <DropdownMenuItem
                      onClick={() => handleDeleteUser(rowUser)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete user or
                      Deactivate Acccount
                    </DropdownMenuItem>
                  </PermissionWrapper>
                )
              ) : (
                <DropdownMenuItem
                  onClick={() => handleRecoverUser(rowUser)}
                  className="text-success"
                >
                  <Shield className="mr-2 h-4 w-4" /> Recover user
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

  const cardComponent = ({ row }: { row: any }) => {
    const user = row;
    const initials = user.fullname
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
    const isAdmin = user.roleId.role.toLowerCase() === 'administrator';
    const adminEmail = 'admin@email.com';

    return (
      <div className="space-y-3">
        {/* Header with Avatar and Name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.fullname} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-base">{user.fullname}</span>
              <span className="text-sm text-muted-foreground">
                @{user.username}
              </span>
            </div>
          </div>

          {/* Actions Dropdown */}

          {!(
            user.email?.trim().toLowerCase() === adminEmail &&
            authUser?.email?.trim().toLowerCase() !== adminEmail
          ) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => handleCopy(user.id)}>
                  Copy user ID
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleViewAuditLogs(user)}>
                  <Logs className="mr-2 h-4 w-4" /> View Audit Logs
                </DropdownMenuItem>

                {/* User Details Preview */}
                <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>

                <PermissionWrapper permission="Update">
                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit user
                  </DropdownMenuItem>
                </PermissionWrapper>

                {authUser?.id !== user.id &&
                  (user.deletedAt === null ? (
                    <PermissionWrapper permission="Delete">
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete user or
                        Deactivate
                      </DropdownMenuItem>
                    </PermissionWrapper>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleRecoverUser(user)}
                      className="text-success"
                    >
                      <Shield className="mr-2 h-4 w-4" /> Recover user
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="text-sm break-all">{user.email}</p>
        </div>

        {/* Role and Failed Attempts */}
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Role</p>
            <Badge
              variant={isAdmin ? 'default' : 'secondary'}
              className="gap-1"
            >
              {isAdmin ? (
                <Shield className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
              {user.roleId.role}
            </Badge>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Failed Attempts
            </p>
            <Badge
              variant={user.failedAttempts > 0 ? 'destructive' : 'outline'}
            >
              {user.failedAttempts}
            </Badge>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{formatDate.shortDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p>{formatDate.shortDate(user.updatedAt)}</p>
          </div>
        </div>

        {/* Deleted Status */}
        {user.deletedAt && (
          <div className="pt-2 border-t">
            <Badge variant="destructive" className="text-xs">
              Deleted: {formatDate.shortDate(user.deletedAt)}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return {
    columns,
    fetchUsers,
    handleSetRefreshFn,
    handleAddNewUser,
    handleCopy,
    cardComponent,
    checkboxActions,

    drawerOpen,
    setDrawerOpen,
    selectedUserForDetails,

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

    renderUserFormModal: () => (
      <UserFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedUser}
      />
    ),

    renderUserDetailsDrawer: () => (
      <UserDetails
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        user={selectedUserForDetails}
      />
    ),
  };
}
