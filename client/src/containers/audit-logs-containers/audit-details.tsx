'use client';
import React, { useState } from 'react';
import DrawerComponent from '@/components/customs/drawer.component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  User,
  Mail,
  Calendar,
  Hash,
  AlertCircle,
  Database,
  ArrowRight,
  Settings,
  Activity,
  Bolt,
} from 'lucide-react';
import { formatDate } from '@syntaxsentinel/date-utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TreeViewer from '@/components/customs/tree-viewer';
import { AuditLogs } from '@/api/protected/audit.api';

interface AuditDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audit: AuditLogs | null;
}

export default function AuditDetails({
  open,
  onOpenChange,
  audit,
}: AuditDetailsProps) {
  if (!audit) return null;

  const initials = audit.performedBy.fullname
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const hasChanges = audit.before || audit.after;

  return (
    <>
      <DrawerComponent
        open={open}
        onOpenChange={onOpenChange}
        title="Audit Details"
        description="View Audit Details"
        direction="bottom"
      >
        <div className="h-[70vh] flex flex-col">
          <div className="space-y-6 py-4">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {audit.performedBy.profileImage ? (
                  <AvatarImage
                    src={audit.performedBy?.profileImage}
                    alt={audit.performedBy.fullname}
                  />
                ) : (
                  <AvatarFallback className="text-lg">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">
                  {audit.performedBy.fullname}
                </h3>
                <p className="text-sm text-muted-foreground">Performed By</p>
              </div>
            </div>

            <Separator />

            {/* Title */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Action
              </h4>
              <p className="text-lg font-medium">{audit.title}</p>
            </div>

            {/* Action Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Bolt className="h-4 w-4" />
                  Action Type
                </h4>
                <Badge variant="outline" className="text-sm">
                  {audit.action}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Transaction ID
                </h4>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded truncate">
                  {audit.transactionId}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timestamp
                </h4>
                <p className="text-sm">
                  {formatDate.dateTime(audit.createdAt)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Data Changes */}
            {hasChanges && (
              <div className="space-y-4 pb-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data Changes
                </h4>

                <Tabs defaultValue="comparison" className="w-full ">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="comparison" className="cursor-pointer">
                      Comparison
                    </TabsTrigger>
                    <TabsTrigger value="before" className="cursor-pointer">
                      Before
                    </TabsTrigger>
                    <TabsTrigger value="after" className="cursor-pointer">
                      After
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="comparison" className="mt-4 space-y-6">
                    <div className="grid md:grid-cols-1 gap-4">
                      {/* Before */}
                      {audit.before && (
                        <div className="flex flex-col border rounded-lg p-3 bg-red-50/50 dark:bg-red-950/20">
                          <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                            <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400" />
                            Before State
                          </div>
                          <ScrollArea className="h-[300px]">
                            <TreeViewer
                              data={audit.before}
                              title="Before"
                              variant="diff"
                            />
                          </ScrollArea>
                        </div>
                      )}

                      {/* After */}
                      {audit.after && (
                        <div className="flex flex-col border rounded-lg p-3 bg-green-50/50 dark:bg-green-950/20">
                          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                            <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
                            After State
                          </div>
                          <ScrollArea className="h-[300px]">
                            <TreeViewer
                              data={audit.after}
                              title="After"
                              variant="diff"
                            />
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="before" className="mt-4">
                    {audit.before ? (
                      <div className="border rounded-lg p-3">
                        <ScrollArea className="h-[400px]">
                          <TreeViewer
                            data={audit.before}
                            title="Before State"
                          />
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No before state available
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="after" className="mt-4">
                    {audit.after ? (
                      <div className="border rounded-lg p-3">
                        <ScrollArea className="h-[400px]">
                          <TreeViewer data={audit.after} title="After State" />
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No after state available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </DrawerComponent>
    </>
  );
}
