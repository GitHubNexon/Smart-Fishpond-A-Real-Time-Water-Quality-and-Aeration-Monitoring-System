'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { formatDate } from '@syntaxsentinel/date-utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Lock,
  Edit,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import AuthLogsTable from '@/containers/authlogs-containers/auth-logs-table';
import { GetAllAuthLogsPaginated } from '@/api/protected/auth.api';
import { extractErrorMessage } from '@/configs/api.helper';
// import { toast } from '@/components/ui/sonner';
import { FileDown } from 'lucide-react';
import { AuthLogOutAllDevices, AuthLogOut } from '@/api/protected/auth.api';
import AlertDialog from '@/components/customs/alert-dialog';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
  subtitle?: string;
  mono?: boolean;
  badge?: 'success' | 'warning' | 'error';
}

export default function AccountPageContent() {
  const { user, loading } = useAuthCheck();
  const router = useRouter();
  const [authLogsCount, setAuthLogsCount] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logOutDialogOpen, setLogOutDialogOpen] = useState(false);

  const handleLogOutAll = async () => {
    try {
      const result = await AuthLogOutAllDevices(user?.id);
      await AuthLogOut();
      localStorage.clear();
      showToastSuccess('Success Logout', result.message, 'top-right');
      router.push('/login');
    } catch (err: unknown) {
      console.log(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    if (user?.id) {
      const fetchCount = async () => {
        try {
          const response = await GetAllAuthLogsPaginated(user.id, {
            page: 1,
            limit: 9999999,
          });
          setAuthLogsCount(response.totalItems);
        } catch (error) {
          console.error('Failed to fetch auth logs count:', error);
          setAuthLogsCount(0);
        }
      };
      fetchCount();
    }
  }, [user?.id]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading account information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 rounded-xl">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Account</h1>
              <p className="text-muted-foreground mt-1">
                Here you can view your account details and profile information
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <Card className="border shadow-xl hover:shadow-2xl transition-all duration-300 bg-zinc-300 dark:bg-background">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
              <div className="flex items-center space-x-4 hover:grayscale transition duration-300">
                <div
                  className="relative w-20 h-20 rounded-full transition-all duration-300 cursor-pointer"
                  onClick={() => router.push('/profile')}
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullname}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove(
                          'hidden',
                        );
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center ${
                      user.profileImage ? 'hidden' : ''
                    }`}
                  >
                    <User className="w-10 h-10" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold">
                    {user.fullname}
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-base">
                    {user.username}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30 transition-colors px-4 py-2"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {user.roleId?.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Mail className="w-5 h-5" />}
                    label="Email Address"
                    value={user.email}
                  />
                  <InfoItem
                    icon={<User className="w-5 h-5" />}
                    label="Username"
                    value={user.username}
                  />
                  <InfoItem
                    icon={<Shield className="w-5 h-5" />}
                    label="Role"
                    value={user.roleId?.role}
                    description={user.roleId?.description}
                  />
                  <InfoItem
                    icon={<KeyRound className="w-5 h-5" />}
                    label="User ID"
                    value={user.id}
                    mono
                  />
                </div>
              </div>

              <Separator />

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary" />
                  Account Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<AlertCircle className="w-5 h-5" />}
                    label="Failed Login Attempts"
                    value={user.failedAttempts?.toString() || '0'}
                    badge={user.failedAttempts === 0 ? 'success' : 'warning'}
                  />
                  <InfoItem
                    icon={<Lock className="w-5 h-5" />}
                    label="Account Status"
                    value={user.lockoutUntil ? 'Locked' : 'Active'}
                    badge={user.lockoutUntil ? 'error' : 'success'}
                  />
                </div>
              </div>

              <Separator />

              {/* Account Activity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Account Activity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Calendar className="w-5 h-5" />}
                    label="Account Created"
                    value={formatDate.readableDateTime(user.createdAt)}
                    subtitle={formatDate.relativeTime(user.createdAt)}
                  />
                  <InfoItem
                    icon={<Calendar className="w-5 h-5" />}
                    label="Last Updated"
                    value={formatDate.readableDateTime(user.updatedAt)}
                    subtitle={formatDate.relativeTime(user.updatedAt)}
                  />
                  <InfoItem
                    icon={<KeyRound className="w-5 h-5" />}
                    label="Version"
                    value={`v${user.version}`}
                  />{' '}
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <div className="group p-4 rounded-lg bg-card border border-border hover:border-primary/50 dark:hover:border-primary/70 hover:shadow-md dark:hover:shadow-primary/10 transition-all duration-200 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="text-muted-foreground group-hover:text-primary transition-colors">
                            <FileDown className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Authentication Logs
                            </p>
                            <p className="font-semibold text-foreground">
                              {authLogsCount !== null
                                ? `You have ${authLogsCount} auth log${
                                    authLogsCount === 1 ? '' : 's'
                                  }`
                                : 'Loading...'}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              Click to view full logs
                            </p>
                          </div>
                        </div>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[90vh] bg-zinc-300 dark:bg-background">
                      <DrawerHeader>
                        <DrawerTitle>Authentication Logs</DrawerTitle>
                        <p className="text-muted-foreground">
                          Full history of your account sign-ins and sessions.
                        </p>
                      </DrawerHeader>
                      <div className="px-4 overflow-y-auto max-h-[60vh]">
                        <AuthLogsTable />
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              <Separator />

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                  Permissions ({user.permissions?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="px-4 py-2 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 dark:bg-primary/10 dark:border-primary/30 dark:hover:bg-primary/20 transition-all duration-200 hover:scale-105 cursor-default"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-2" />
                        {permission.permission}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No permissions assigned
                    </p>
                  )}
                </div>
              </div>

              {/* Role Details */}
              {user.roleId && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-primary" />
                      Role Details
                    </h3>
                    <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-4 space-y-3 border border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Role Name
                          </p>
                          <p className="font-semibold text-foreground">
                            {user.roleId.role}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                        >
                          v{user.roleId.version}
                        </Badge>
                      </div>
                      {user.roleId.description && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Description
                          </p>
                          <p className="text-foreground">
                            {user.roleId.description}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-muted-foreground">
                        <div>
                          <p>
                            Created:{' '}
                            {formatDate.shortDate(user.roleId.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p>
                            Updated:{' '}
                            {formatDate.shortDate(user.roleId.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary" />
                  Security Actions
                </h3>
                <div
                  className="group p-4 rounded-lg bg-card border border-border hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setLogOutDialogOpen(true)}
                >
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-red-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Log out of all devices
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Log out of all active sessions across all devices,
                        including your current session. It may take up to 30
                        minutes for other devices to be logged out.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog
        isOpen={logOutDialogOpen}
        onCancel={() => setLogOutDialogOpen(false)}
        onConfirm={async () => {
          setLogOutDialogOpen(false);
          await handleLogOutAll();
        }}
        title="Log out of all devices"
        description="Are you sure you want to log out of all devices? This will end all active sessions, including your current one. It may take up to 30 minutes for other devices to be logged out."
        isProceed="Log Out"
        isCanceled="Cancel"
      />
    </>
  );
}

// Helper Component for Information Items
function InfoItem({
  icon,
  label,
  value,
  description,
  subtitle,
  mono,
  badge,
}: InfoItemProps) {
  const getBadgeColor = () => {
    switch (badge) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800';
      default:
        return '';
    }
  };

  return (
    <div className="group p-4 rounded-lg bg-card border border-border hover:border-primary/50 dark:hover:border-primary/70 hover:shadow-md dark:hover:shadow-primary/10 transition-all duration-200">
      <div className="flex items-start space-x-3">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </p>
          {badge ? (
            <Badge
              variant="outline"
              className={`${getBadgeColor()} font-semibold`}
            >
              {value}
            </Badge>
          ) : (
            <p
              className={`font-semibold text-foreground break-all ${
                mono ? 'font-mono text-xs' : ''
              }`}
            >
              {value || 'N/A'}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
