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
  BadgeCheck,
  Logs,
} from 'lucide-react';
import {
  GetAllEmployeePaginated,
  softDeleteEmployee,
  RecoverEmployee,
  bulkVerifyEmployees,
  verifyEmployee,
} from '@/api/protected/employee.api';
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
import { Check } from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import PermissionWrapper from '@/components/customs/permission-wrapper';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import {
  EmployeeData,
  GetAllPaginatedEmployee,
} from '@/interfaces/employee-api.interface';
import EmployeeFormModal from '@/modals/employee-form-modals/employee-form.modal';
import EmployeeDetails from './employee-details';

import { getAuditLogsByTransaction } from '@/api/protected/audit.api';
import { AuditLogs } from '@/api/protected/audit.api';
import DrawerComponent from '@/components/customs/drawer.component';
import AuditLogsViewer from '@/components/customs/audit-logs-viewer';

export function useEmployeeTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );

  const [auditLogsDrawerOpen, setAuditLogsDrawerOpen] = useState(false);
  const [auditLogsData, setAuditLogsData] = useState<AuditLogs[]>([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<EmployeeData | null>(null);

  const handleViewAuditLogs = async (emp: EmployeeData) => {
    try {
      setIsLoadingAuditLogs(true);
      setAuditLogsDrawerOpen(true);
      const response = await getAuditLogsByTransaction(`TX_EMPLOYEE-${emp.id}`);
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

  const handleViewDetails = (emp: EmployeeData) => {
    setSelectedForDetails(emp);
    setDrawerOpen(true);
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
        window.location.hash === '#add-employee' ||
        window.location.hash === '#edit-employee'
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
  const fetchEmployee = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await GetAllEmployeePaginated(params);
      if (!response.employee_data)
        throw new Error('Invalid response structure');

      return {
        data: response.employee_data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error) {
      // toast.error({
      //   title: 'Fetch failed',
      //   description: extractErrorMessage(error),
      // });
      console.log(extractErrorMessage(error));
      throw error;
    }
  };

  // Action Handlers
  const handleAddNewEmplyoee = () => {
    window.location.hash = 'add-employee';
    setSelectedEmployee(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditEmplyoee = (emp: EmployeeData) => {
    window.location.hash = 'edit-employee';
    setSelectedEmployee(emp);
    setModalMode('edit');
    setModalOpen(true);
  };

  /** to be deletd 
  const handleDeleteEmployee = async (emp: EmployeeData) => {
    try {
      const response = await softDeleteEmployee(emp.id);
      showToastSuccess('Delete Employee', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Deleting',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleRecoverEmployee = async (emp: EmployeeData) => {
    try {
      const response = await RecoverEmployee(emp.id);
      showToastSuccess('Recover Employee', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Recover Employee',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };
  */

  const handleCopy = (empId: string) => {
    navigator.clipboard.writeText(empId);
    showToastSuccess(
      'Copy ClipBoard',
      'Employee Id Copy Succesfully',
      'top-center',
    );
  };

  const handleEmployeeVerification = async (emp: EmployeeData) => {
    try {
      if (!emp) {
        showToastError('Verification Error', 'ID is missing', 'bottom-right');
        return;
      }
      const response = await verifyEmployee(emp.id);
      showToastSuccess('Employee Verification', response.message, 'top-right');
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Employee Verification',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const handleBulkVerification = async (emps: EmployeeData[]) => {
    try {
      if (!emps || emps.length < 2) {
        showToastError(
          'Bulk Verification Error',
          'Please select at least 2 employees for verification',
          'bottom-right',
        );
        return;
      }
      const ids = emps.map((emp) => emp.id);
      const response = await bulkVerifyEmployees(ids);
      showToastSuccess(
        'Bulk Verification Employees',
        response.message,
        'top-right',
      );
      refreshFn?.();
    } catch (error: unknown) {
      showToastError(
        'Error Bulk Verification Employees',
        extractErrorMessage(error),
        'bottom-right',
      );
      console.log(extractErrorMessage(error));
    }
  };

  const checkboxActions = [
    {
      label: 'Verify of Employees',
      variant: 'outline' as const,
      icon: <BadgeCheck className="-ms-1 opacity-60" size={16} />,
      action: handleBulkVerification,
    },
    // {
    //   label: 'Export Selected',
    //   variant: 'outline' as const,
    //   icon: <FileDown className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkExport,
    // },
  ];

  const columns: ColumnDef<EmployeeData>[] = [
    {
      id: 'select',
      size: 40,
      header: ({ table }) => {
        const selectableRows = table
          .getRowModel()
          .rows.filter(
            (row) => !row.original.isVerified && !row.original.deletedAt,
          );

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
        const isVerified = row.original.isVerified;
        const isDeleted = row.original.deletedAt !== null;

        if (isVerified || isDeleted) return null;

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
      accessorKey: 'isVerified',
      size: 150,
      header: 'Verified Status',
      cell: ({ getValue }) => {
        const isVerified = getValue() as boolean;

        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-1 rounded-full 
          ${
            isVerified
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-400'
          }`}
          >
            <Check className="w-4 h-4" />
            {isVerified ? 'Verified' : 'Not Verified'}
          </Badge>
        );
      },
    },
    {
      enableSorting: false,
      enableHiding: false,
      accessorKey: 'fullname',
      size: 250,
      header: 'Employee Full Name',
      cell: ({ row }) => {
        const { firstName, middleName, lastName } = row.original || {};

        const nameParts = [firstName, middleName, lastName].filter(Boolean);

        const fullName =
          nameParts.length === 3
            ? `${nameParts[0]} ${nameParts[1]} ${nameParts[2]}`
            : nameParts.join(' ');

        const initials = [firstName, lastName]
          .filter(Boolean)
          .map((n) => n[0].toUpperCase())
          .join('');

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{fullName || initials}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'employeeId',
      size: 200,
      header: 'Employee ID',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'email',
      size: 200,
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="text-sm break-words w-10">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'position',
      size: 200,
      header: 'Position',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'department',
      size: 200,
      header: 'Department',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      id: 'status',
      size: 120,
      header: 'Status',
      cell: ({ row }) => {
        const isArchived = row.original.deletedAt !== null;

        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isArchived
                ? 'bg-gray-100 text-gray-500 border-gray-300'
                : 'bg-green-100 text-green-600 border-green-300'
            }`}
          >
            {isArchived ? 'Archived' : 'Active'}
          </Badge>
        );
      },
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
      id: 'actions',
      size: 60,
      header: '',
      cell: ({ row }) => {
        const rowEmp = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleCopy(rowEmp.employeeId)}>
                Copy Employe ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewAuditLogs(rowEmp)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(rowEmp)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <PermissionWrapper permission="Update">
                <DropdownMenuItem onClick={() => handleEditEmplyoee(rowEmp)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Employee
                </DropdownMenuItem>
              </PermissionWrapper>

              {!rowEmp.isVerified && rowEmp.deletedAt === null && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleEmployeeVerification(rowEmp)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verified Employee
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}
              {/* to be deleted */}
              {/* {rowEmp.deletedAt === null ? (
                authUser?.id !== rowEmp.id && (
                  <PermissionWrapper permission="Delete">
                    <DropdownMenuItem
                      onClick={() => handleDeleteEmployee(rowEmp)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
                    </DropdownMenuItem>
                  </PermissionWrapper>
                )
              ) : (
                <DropdownMenuItem
                  onClick={() => handleRecoverEmployee(rowEmp)}
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
    const emp = row;
    const { firstName, middleName, lastName } = row || {};

    const nameParts = [firstName, middleName, lastName].filter(Boolean);

    const fullName =
      nameParts.length === 3
        ? `${nameParts[0]} ${nameParts[1]} ${nameParts[2]}`
        : nameParts.join(' ');

    return (
      <div className="space-y-3">
        <div className="flex items-end justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => handleCopy(emp.employeeId)}>
                Copy Employe ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewAuditLogs(emp)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleViewDetails(emp)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <PermissionWrapper permission="Update">
                <DropdownMenuItem onClick={() => handleEditEmplyoee(emp)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Employee
                </DropdownMenuItem>
              </PermissionWrapper>

              {!emp.isVerified && emp.deletedAt === null && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleEmployeeVerification(emp)}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verified Employee
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              {/* to be deleted */}
              {/* {emp.deletedAt === null ? (
                authUser?.id !== emp.id && (
                  <PermissionWrapper permission="Delete">
                    <DropdownMenuItem
                      onClick={() => handleDeleteEmployee(emp)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
                    </DropdownMenuItem>
                  </PermissionWrapper>
                )
              ) : (
                <DropdownMenuItem
                  onClick={() => handleRecoverEmployee(emp)}
                  className="text-success"
                >
                  <Shield className="mr-2 h-4 w-4" /> Recover Employee
                </DropdownMenuItem>
              )} */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Employee ID</p>
          <p className="text-sm break-all">{emp.employeeId}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Employee Full Name</p>
          <p className="text-sm break-all">{fullName}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="text-sm break-all">{emp.email}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Employee Position</p>
          <p className="text-sm break-all">{emp.position}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Employee Deparment</p>
          <p className="text-sm break-all">{emp.department}</p>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{formatDate.shortDate(emp.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p>{formatDate.shortDate(emp.updatedAt)}</p>
          </div>
        </div>

        {/* Deleted Status */}
        {emp.deletedAt && (
          <div className="pt-2 border-t">
            <Badge variant="destructive" className="text-xs">
              Deleted: {formatDate.shortDate(emp.deletedAt)}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return {
    columns,
    fetchEmployee,
    handleSetRefreshFn,
    handleAddNewEmplyoee,
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

    renderUserFormModal: () => (
      <EmployeeFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedEmployee}
      />
    ),

    renderEmployeeDetailsDrawer: () => (
      <EmployeeDetails
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        emp={selectedForDetails}
      />
    ),
  };
}
