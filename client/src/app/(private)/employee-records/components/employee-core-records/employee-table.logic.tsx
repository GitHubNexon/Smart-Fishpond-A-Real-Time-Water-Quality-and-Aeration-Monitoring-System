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
  Briefcase,
  Building2,
  Mail,
  Phone,
  MapPin,
  ThumbsUp,
  Tag,
  FileText,
  GraduationCap,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  UserCircle,
  Clock,
  UserCheck,
  Users2,
  User2,
  MapPinHouse,
} from 'lucide-react';
// import {
//   GetAllEmployeePaginated,
//   softDeleteEmployee,
//   RecoverEmployee,
//   bulkVerifyEmployees,
//   verifyEmployee,
// } from '@/api/protected/employee.api';
import {
  GetAllEmployeePaginated,
  verifyEmployee,
} from '@/api/protected/employee-api/employee.api';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
} from '@/api/protected/employee-api/employee.interface';
// import EmployeeFormModal from '@/modals/employee-form-modals/employee-form.modal';
import EmployeeFormModal from './employee-form.modal';
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
    filters?: Record<string, any>;
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
  const handleAddNewEmployee = () => {
    window.location.hash = 'add-employee';
    setSelectedEmployee(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditEmployee = (emp: EmployeeData) => {
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

  const checkboxActions = [
    // {
    //   label: 'Verify of Employees',
    //   variant: 'outline' as const,
    //   icon: <BadgeCheck className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkVerification,
    // },
    // {
    //   label: 'Export Selected',
    //   variant: 'outline' as const,
    //   icon: <FileDown className="-ms-1 opacity-60" size={16} />,
    //   action: handleBulkExport,
    // },
  ];

  const columns: ColumnDef<EmployeeData>[] = [
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
        const { firstName, middleName, lastName } =
          row.original.personalInfo || {};

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
      enableSorting: false,
      enableHiding: false,
      accessorKey: 'contactInfo.contactEmail',
      size: 200,
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="text-sm wrap-break-word w-10">
          {getValue() as string}
        </span>
      ),
    },
    {
      header: 'Position',
      size: 200,
      cell: ({ row }) => {
        const coreWorkInfo = row.original.coreWorkInfo ?? [];

        // Filter only verified items
        const verified = coreWorkInfo
          .filter((item) => item.isVerified)
          .sort(
            (a, b) =>
              new Date(b.verifiedAt ?? '').getTime() -
              new Date(a.verifiedAt ?? '').getTime(),
          );

        const latest = verified[0];

        return (
          <span className="text-sm wrap-break-word w-10">
            {latest?.position ?? '—'}
          </span>
        );
      },
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
                <DropdownMenuItem onClick={() => handleEditEmployee(rowEmp)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Employee
                </DropdownMenuItem>
              </PermissionWrapper>

              <PermissionWrapper permission="Update">
                <DropdownMenuItem
                  onClick={() => handleEmployeeVerification(rowEmp)}
                  disabled={rowEmp.isVerified || rowEmp.deletedAt !== null}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {rowEmp.isVerified ? 'Already Verified' : 'Verify Employee'}
                </DropdownMenuItem>
              </PermissionWrapper>

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
    const data = row?.original || row;
    if (!data) return null;

    const personal = data.personalInfo || {};
    const address = data.addressInfo || {};
    const contact = data.contactInfo || {};
    const gov = data.governmentInfo || {};
    const latestWork =
      (data.coreWorkInfo || []).find((w) => w.isVerified) ||
      (data.coreWorkInfo || [])[0];

    const fullName =
      [personal.firstName, personal.middleName, personal.lastName]
        .filter(Boolean)
        .join(' ') || 'N/A';

    const initials =
      [personal.firstName?.[0], personal.lastName?.[0]]
        .filter(Boolean)
        .join('')
        .toUpperCase() || 'NA';

    const fullAddress =
      [
        address.street,
        address.barangay,
        address.city,
        address.province,
        address.region,
      ]
        .filter(Boolean)
        .join(', ') || 'N/A';

    const preparedByName = data.preparedBy?.fullname || 'N/A';

    const computeAge = (date: string) => {
      if (!date) return null;
      const birth = new Date(date);
      const diff = Date.now() - birth.getTime();
      return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    };
    const age = computeAge(personal.birthDate);

    return (
      <Card className="group relative overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 bg-card">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {data.isVerified ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Verified
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                Pending
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-4 pt-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-primary-foreground">
                  {initials}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card flex items-center justify-center shadow-md border border-border">
                <User className="h-3 w-3 text-primary" />
              </div>
            </div>

            {/* Name + ID */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold truncate text-foreground">
                {fullName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-semibold">
                  {data.employeeId || 'N/A'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Employee ID
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          {/* Work Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              Work Information
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Position',
                  value: latestWork?.position,
                  icon: Briefcase,
                },
                {
                  label: 'Department',
                  value: latestWork?.department,
                  icon: FileText,
                },
                {
                  label: 'Employment Type',
                  value: latestWork?.employmentType,
                  icon: UserCircle,
                },
                {
                  label: 'Work Schedule',
                  value: latestWork?.workSchedule,
                  icon: Clock,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary border border-border"
                >
                  <item.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      {item.label}
                    </p>
                    <p className="font-semibold text-sm text-foreground truncate">
                      {item.value || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <UserCircle className="h-3.5 w-3.5 text-primary" />
              Personal Details
            </h4>

            <div className="space-y-2">
              {/* Birthdate */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary border border-border">
                <Calendar className="h-4 w-4 text-primary shrink-0" />

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs text-muted-foreground font-medium">
                    Birth Date
                  </p>

                  <p className="font-semibold text-sm text-foreground">
                    {formatDate.shortDate(personal.birthDate || 'N/A')}
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-foreground">
                      {age ? `${age} yrs old` : 'Age N/A'}
                    </p>

                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></span>

                    <p className="font-semibold text-sm text-foreground">
                      {personal.gender || 'Gender N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-secondary border border-border">
                <MapPinHouse className="h-4 w-4 text-primary mt-0.5 shrink-0" />

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs text-muted-foreground font-medium">
                    Address
                  </p>

                  <p className="text-sm font-semibold text-foreground line-clamp-2">
                    {fullAddress || 'No address provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <UserCircle className="h-3.5 w-3.5" />
              <span>
                Prepared by:{' '}
                <span className="font-medium text-foreground">
                  {preparedByName}
                </span>
              </span>
            </div>

            {data.verifiedAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{data.verifiedAt}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return {
    columns,
    fetchEmployee,
    handleSetRefreshFn,
    handleAddNewEmployee,
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
