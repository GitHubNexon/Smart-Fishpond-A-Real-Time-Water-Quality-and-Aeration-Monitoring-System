'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Edit,
  Eye,
  ShieldCheck,
  BadgeCheck,
  Logs,
  Briefcase,
  FileText,
  CheckCircle2,
  UserCircle,
  Check,
  Monitor,
} from 'lucide-react';
import { GetAllJobDetailsPaginated } from '@/api/protected/job-details-api/employee-job-details.api';
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
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@syntaxsentinel/date-utils';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';
import PermissionWrapper from '@/components/customs/permission-wrapper';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import {
  GetAllPaginatedJobDetails,
  JobDetailsData,
} from '@/api/protected/job-details-api/employee-job-details.interface';
import {
  AuditLogs,
  getAuditLogsByTransaction,
} from '@/api/protected/audit.api';
import DrawerComponent from '@/components/customs/drawer.component';
import AuditLogsViewer from '@/components/customs/audit-logs-viewer';

export function useEmployeeJobDetailsTableLogic() {
  const { user: authUser } = useAuthCheck();
  const router = useRouter();
  const [refreshFn, setRefreshFn] = useState<(() => void) | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedJobDetails, setSelectedJobDetails] =
    useState<JobDetailsData | null>(null);

  const [auditLogsDrawerOpen, setAuditLogsDrawerOpen] = useState(false);
  const [auditLogsData, setAuditLogsData] = useState<AuditLogs[]>([]);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] =
    useState<JobDetailsData | null>(null);

  const handleViewAuditLogs = async (jbd: JobDetailsData) => {
    try {
      setIsLoadingAuditLogs(true);
      setAuditLogsDrawerOpen(true);
      const response = await getAuditLogsByTransaction(
        `TX_EMP-JOB-DETAILS-${jbd.id}`,
      );
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
    } finally {
      setIsLoadingAuditLogs(false);
    }
  };

  const handleViewDetails = (jbd: JobDetailsData) => {
    setSelectedForDetails(jbd);
    setDrawerOpen(true);
  };

  const handleModalSuccess = () => {
    refreshFn?.();
  };

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
        window.location.hash === '#add-employee-job-details' ||
        window.location.hash === '#edit-employee-job-details'
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

  const fetchData = async (params: {
    page: number;
    limit: number;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) => {
    try {
      const response = await GetAllJobDetailsPaginated(params);
      if (!response.job_details_data)
        throw new Error('Invaid response structure');
      return {
        data: response.job_details_data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      };
    } catch (error: unknown) {
      console.log(extractErrorMessage(error));
      throw error;
    }
  };

  const handleAddNewEmployeeJobDetails = () => {
    window.location.hash = 'add-employee-job-details';
    setSelectedJobDetails(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditEmployeeJobDetails = (jbd: JobDetailsData) => {
    window.location.hash = 'edit-employee-job-details';
    setSelectedJobDetails(jbd);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCopy = (jbd: string) => {
    navigator.clipboard.writeText(jbd);
    showToastSuccess(
      'Copy ClipBoard',
      'Job-Details Id Copy Succesfully',
      'top-center',
    );
  };

  const employmentStatusColors: Record<string, string> = {
    Regular: 'bg-green-500 text-white',
    'Part-Time': 'bg-orange-500 text-white',
    Contract: 'bg-gray-800 text-white',
    Probation: 'bg-gray-500 text-white',
    Intern: 'bg-gray-500 text-white',
    'Project-Based': 'bg-gray-500 text-white',
  };

  const employmentTypeColors: Record<string, string> = {
    Active: 'bg-green-500 text-white',
    Resigned: 'bg-orange-500 text-white',
    Retired: 'bg-gray-800 text-white',
    Terminated: 'bg-gray-500 text-white',
  };

  const checkboxActions = [];

  const columns: ColumnDef<JobDetailsData>[] = [
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
      accessorKey: 'employee.employeeId',
      size: 200,
      header: 'Employee ID',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
    },
    {
      enableSorting: false,
      enableHiding: false,
      accessorKey: 'fullname',
      size: 250,
      header: 'Employee Full Name',
      cell: ({ row }) => {
        const { firstName, middleName, lastName } =
          row.original.employee?.personalInfo || {};

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
      accessorKey: 'employmentStatus',
      size: 200,
      header: 'Employment Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const badgeClass =
          employmentStatusColors[status] || 'bg-gray-300 text-gray-600';
        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'employmentType',
      size: 200,
      header: 'Employment Type',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const badgeClass =
          employmentTypeColors[status] || 'bg-gray-300 text-gray-600';
        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'position',
      size: 200,
      header: 'Employee Position',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() as string}</span>
      ),
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

              <DropdownMenuItem onClick={() => handleCopy(rowData.id)}>
                Copy Job Details Id
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleViewAuditLogs(rowData)}>
                <Logs className="mr-2 h-4 w-4" /> View Audit Logs
              </DropdownMenuItem>

              {/* <DropdownMenuItem onClick={() => handleViewDetails(rowData)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem> */}

              <DropdownMenuSeparator />

              {!rowData.isVerified && (
                <PermissionWrapper permission="Update">
                  <DropdownMenuItem
                    onClick={() => handleEditEmployeeJobDetails(rowData)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Job Details
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}

              {/* 
              <PermissionWrapper permission="Update">
                <DropdownMenuItem
                  onClick={() => handleEmployeeVerification(rowEmp)}
                  disabled={rowEmp.isVerified || rowEmp.deletedAt !== null}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {rowEmp.isVerified ? 'Already Verified' : 'Verify Employee'}
                </DropdownMenuItem>
              </PermissionWrapper> */}

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
    fetchData,
    handleSetRefreshFn,
    handleAddNewEmployeeJobDetails,
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

    // renderUserFormModal: () => (
    //   <EmployeeFormModal
    //     open={modalOpen}
    //     close={closeModal}
    //     onSuccess={handleModalSuccess}
    //     mode={modalMode}
    //     initialData={selectedEmployee}
    //   />
    // ),
  };
}
