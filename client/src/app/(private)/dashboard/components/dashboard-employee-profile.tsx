'use client';
import React, { useEffect, useState } from 'react';
import { EmployeeData } from '@/interfaces/employee-api.interface';
import { extractErrorMessage } from '@/configs/api.helper';
// import { formatDate } from '@syntaxsentinel/date-utils';
import { formatDate } from '@syntaxsentinel/date-utils';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { getEmployeeById } from '@/api/protected/employee.api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Building2,
  IdCard,
  Hash,
} from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-2xl lg:col-span-1" />
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  </div>
);

export default function DashboardEmployeeProfile() {
  const { user } = useAuthCheck();
  const employeeId = user?.employeeId.id;

  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [issuedAssets, setIssuedAssets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeById(employeeId);
        setEmployee(response.data);

        if (
          response.data.issuedAsset &&
          Array.isArray(response.data.issuedAsset)
        ) {
          const processedAssets = response.data.issuedAsset.map(
            (asset: any) => {
              const approvedTx = asset.transactions?.find(
                (tx: any) =>
                  tx.approvalStatus === 'approved' &&
                  tx.inventory?.id === asset.id,
              );
              return {
                ...asset,
                issuedDate:
                  approvedTx?.approvedAt || approvedTx?.transactionDate,
              };
            },
          );
          setIssuedAssets(processedAssets);
        }

        showToastSuccess(
          'Employee Profile Loaded successfully',
          'Data Loaded Successfully',
          'top-right',
        );
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        console.error('Failed to fetch employee:', errorMessage);
        showToastError('Failed to fetch employee', errorMessage, 'top-center');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const getStatusVariant = (
    status: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      Issued: 'default',
      'New-Available': 'secondary',
      'In-Repair': 'destructive',
    };
    return variants[status] || 'outline';
  };

  const totalPages = Math.ceil(issuedAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = issuedAssets.slice(startIndex, endIndex);

  if (loading) return <LoadingSkeleton />;

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Employee Not Found</CardTitle>
            <CardDescription>
              The employee with ID {employeeId} could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const fullName = [employee.firstName, employee.middleName, employee.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="min-h-screen">
      <div className=" space-y-6">
        {/* Hero Profile Card */}
        <Card className="relative overflow-hidden border-none shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-90" />
          <div className="absolute inset-0 opacity-30" />

          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 rounded-3xl ring-8 ring-white/20 shadow-2xl border-4 border-white/10">
                <AvatarImage
                  src={
                    employee.user?.profileImage ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`
                  }
                  alt={fullName}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-bold bg-white/10 backdrop-blur-sm text-white">
                  {employee.firstName.charAt(0)}
                  {employee.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                      {fullName}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white/90">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <IdCard className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {employee.employeeId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {employee.position}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {employee.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      variant={!employee.deletedAt ? 'default' : 'secondary'}
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 px-4 py-2 text-sm"
                    >
                      {!employee.deletedAt ? '● Active' : '○ Inactive'}
                    </Badge>
                    {employee.isVerified && (
                      <Badge className="bg-emerald-500/20 backdrop-blur-sm border-emerald-400/30 text-white hover:bg-emerald-500/30 px-4 py-2 text-sm">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 text-white">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-white/70 mb-0.5">Email</p>
                        <p className="text-sm font-medium md:w-45 wrap-break-word">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 text-white">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-white/70 mb-0.5">Contact</p>
                        <p className="text-sm font-medium">
                          {employee.contactNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 text-white">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-white/70 mb-0.5">
                          Assets Issued
                        </p>
                        <p className="text-sm font-medium">
                          {issuedAssets.length} Item
                          {issuedAssets.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Details */}
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <div className="flex items-center gap-2">
                      {employee.isVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-600">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-semibold text-orange-600">
                            Unverified
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Version</span>
                      <Badge variant="outline" className="font-mono">
                        v{employee.version}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Database ID</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {employee.id.slice(0, 8)}...
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="w-0.5 h-full bg-gradient-to-b from-emerald-500 to-transparent" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium mb-1">
                        Account Created
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate.readableDateTime(employee.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {formatDate.relativeTime(employee.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {employee.deletedAt && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium mb-1">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate.readableDateTime(employee.updatedAt)}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {formatDate.relativeTime(employee.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {employee.deletedAt && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">
                          Account Deleted
                        </p>
                        <p className="text-xs text-red-600">
                          {formatDate.readableDateTime(employee.deletedAt)}
                        </p>
                        <p className="text-xs text-red-600 font-medium mt-0.5">
                          {formatDate.relativeTime(employee.deletedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Assets */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      Accountable Assets
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {issuedAssets.length} asset
                      {issuedAssets.length !== 1 ? 's' : ''} under your
                      responsibility
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Hash className="h-4 w-4 mr-1" />
                    {issuedAssets.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {issuedAssets.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                      <Package className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Assets Assigned
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This employee currently has no assets issued.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
                      {currentAssets.map((asset) => (
                        <Card
                          key={asset.id}
                          className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800"
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-600 transition-all">
                                  {asset.asset.assetImage ? (
                                    <img
                                      src={asset.asset.assetImage}
                                      alt={asset.asset.assetName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-10 w-10 text-slate-400" />
                                  )}
                                </div>
                                <Badge
                                  variant={getStatusVariant(asset.status)}
                                  className="absolute -top-2 -right-2 shadow-lg"
                                >
                                  {asset.status}
                                </Badge>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {asset.asset.assetName}
                                </h4>
                                <p className="text-xs text-muted-foreground font-mono mb-3">
                                  {asset.asset.assetNo}
                                </p>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Hash className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      INV:
                                    </span>
                                    <code className="font-mono font-medium">
                                      {asset.inventoryNo}
                                    </code>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {asset.location || 'Location not set'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs pt-2 border-t">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      Issued{' '}
                                      {formatDate.relativeTime(
                                        asset.issuedDate,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t">
                        <p className="text-sm text-muted-foreground">
                          Showing <strong>{startIndex + 1}</strong> to{' '}
                          <strong>
                            {Math.min(endIndex, issuedAssets.length)}
                          </strong>{' '}
                          of <strong>{issuedAssets.length}</strong>
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => p - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          <div className="flex gap-1">
                            {Array.from(
                              { length: Math.min(totalPages, 5) },
                              (_, i) => {
                                const pageNum =
                                  totalPages <= 5
                                    ? i + 1
                                    : currentPage <= 3
                                    ? i + 1
                                    : currentPage >= totalPages - 2
                                    ? totalPages - 4 + i
                                    : currentPage - 2 + i;

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      currentPage === pageNum
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="w-9 h-9"
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              },
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
