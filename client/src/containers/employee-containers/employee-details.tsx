'use client';
import React from 'react';
import DrawerComponent from '@/components/customs/drawer.component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Building2,
  Briefcase,
  Hash,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeData } from '@/interfaces/employee-api.interface';
import { formatDate } from '@syntaxsentinel/date-utils';
import { useRouter } from 'next/navigation';

interface EmployeeDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emp: EmployeeData | null;
}

export default function EmployeeDetails({
  open,
  onOpenChange,
  emp,
}: EmployeeDetailsProps) {
  if (!emp) return null;
  const router = useRouter();

  return (
    <DrawerComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Employee Details"
      description="View detailed information about this employee"
      direction="bottom"
    >
      <div className="h-[75vh] flex flex-col">
        {/* Header Section - Enhanced */}
        <div className="mb-6 px-1">
          <div className="flex items-start gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
                <AvatarImage
                  src={
                    emp.user?.profileImage
                      ? emp.user.profileImage
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${emp.firstName} ${emp.lastName}`
                  }
                />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {emp.firstName.charAt(0)}
                  {emp.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {emp.isVerified && (
                <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-background">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {emp.firstName} {emp.middleName && `${emp.middleName} `}
                {emp.lastName}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge
                  variant={emp.isVerified ? 'default' : 'secondary'}
                  className="shadow-sm"
                >
                  {emp.isVerified ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5" /> Unverified
                    </span>
                  )}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  v{emp.version}
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {emp.employeeId}
                </Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>{emp.contactNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-2">
          <button
            onClick={() => router.push(`/employee/${emp.employeeId}`)}
            className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-600 transition cursor-pointer"
          >
            View Full Details
          </button>
        </div>
        <Separator className="mb-6" />

        {/* Tabs Section - Enhanced */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 w-full h-11 bg-muted/40 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <User className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="employment"
              className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Employment
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <ScrollArea className="h-[calc(75vh-280px)]">
              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="mt-0 px-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Contact Information
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Email Address
                          </p>
                          <p className="font-medium truncate">{emp.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Contact Number
                          </p>
                          <p className="font-medium">{emp.contactNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Hash className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Employee ID
                          </p>
                          <p className="font-medium font-mono">
                            {emp.employeeId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Joined Date
                          </p>
                          <p className="font-medium">
                            {formatDate.shortDate(emp.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* EMPLOYMENT TAB */}
              <TabsContent value="employment" className="mt-0 px-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Employment Details
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Department
                          </p>
                          <p className="font-medium">{emp.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-pink-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Position
                          </p>
                          <p className="font-medium">{emp.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Created On
                          </p>
                          <p className="font-medium">
                            {formatDate.readableDateTime(emp.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Last Updated
                          </p>
                          <p className="font-medium">
                            {formatDate.relativeTime(emp.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SYSTEM TAB */}
              <TabsContent value="system" className="mt-0 px-1">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">
                          UUID
                        </p>
                        <code className="text-sm font-mono break-all bg-muted px-3 py-1.5 rounded block">
                          {emp.id}
                        </code>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
                            <Database className="h-5 w-5 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Version
                            </p>
                            <Badge variant="outline" className="font-mono">
                              v{emp.version}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <Trash2 className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Deleted At
                            </p>
                            <p className="font-medium text-sm">
                              {emp.deletedAt
                                ? formatDate.readableDateTime(emp.deletedAt)
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Last Updated
                          </p>
                          <p className="font-medium">
                            {formatDate.readableDateTime(emp.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </DrawerComponent>
  );
}
