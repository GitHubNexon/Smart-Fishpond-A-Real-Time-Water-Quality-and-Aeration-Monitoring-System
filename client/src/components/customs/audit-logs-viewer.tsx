'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DrawerComponent from '@/components/customs/drawer.component';
import TreeViewer from '@/components/customs/tree-viewer';
import { formatDate } from '@syntaxsentinel/date-utils';
import { Eye, Database, Hash, Calendar, Bolt, User } from 'lucide-react';
import { AuditLogs } from '@/api/protected/audit.api';

// Types
interface UserData {
  id: string;
  fullname: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface AuditLogsViewerProps {
  auditLogs: AuditLogs[];
  isLoading?: boolean;
}

export default function AuditLogsViewer({
  auditLogs,
  isLoading = false,
}: AuditLogsViewerProps) {
  const [selectedAudit, setSelectedAudit] = useState<AuditLogs | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDetails = (audit: AuditLogs) => {
    setSelectedAudit(audit);
    setDrawerOpen(true);
  };

  const getInitials = (fullname: string) => {
    return fullname
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const hasChanges = selectedAudit?.before || selectedAudit?.after;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading audit logs...</p>
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Database className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No audit logs found</p>
      </div>
    );
  }

  return (
    <>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Performed By</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((audit) => {
              const initials = getInitials(audit.performedBy.fullname);

              return (
                <TableRow key={audit.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {audit.performedBy.profileImage ? (
                          <AvatarImage
                            src={audit.performedBy.profileImage}
                            alt={audit.performedBy.fullname}
                          />
                        ) : (
                          <AvatarFallback>{initials}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {audit.performedBy.fullname}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{audit.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{audit.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-muted-foreground">
                      {audit.transactionId.substring(0, 12)}...
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate.readableDateTime(audit.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(audit)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Drawer for Details */}
      <DrawerComponent
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Audit Log Details"
        description="View detailed audit log information"
        direction="bottom"
      >
        {selectedAudit && (
          <div className="h-[70vh] flex flex-col">
            <div className="space-y-6 py-4">
              {/* User Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {selectedAudit.performedBy.profileImage ? (
                    <AvatarImage
                      src={selectedAudit.performedBy.profileImage}
                      alt={selectedAudit.performedBy.fullname}
                    />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {getInitials(selectedAudit.performedBy.fullname)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedAudit.performedBy.fullname}
                  </h3>
                </div>
              </div>

              <Separator />

              {/* Action Title */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Action
                </h4>
                <p className="text-lg font-medium">{selectedAudit.title}</p>
              </div>

              {/* Action Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Bolt className="h-4 w-4" />
                    Action Type
                  </h4>
                  <Badge variant="outline" className="text-sm">
                    {selectedAudit.action}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Transaction ID
                  </h4>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded truncate">
                    {selectedAudit.transactionId}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timestamp
                  </h4>
                  <p className="text-sm">
                    {formatDate.dateTime(selectedAudit.createdAt)}
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

                  <Tabs defaultValue="comparison" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="comparison"
                        className="cursor-pointer"
                      >
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
                        {selectedAudit.before && (
                          <div className="flex flex-col border rounded-lg p-3 bg-red-50/50 dark:bg-red-950/20">
                            <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                              <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400" />
                              Before State
                            </div>
                            <ScrollArea className="h-[300px]">
                              <TreeViewer
                                data={selectedAudit.before}
                                title="Before"
                                variant="diff"
                              />
                            </ScrollArea>
                          </div>
                        )}

                        {/* After */}
                        {selectedAudit.after && (
                          <div className="flex flex-col border rounded-lg p-3 bg-green-50/50 dark:bg-green-950/20">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                              <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
                              After State
                            </div>
                            <ScrollArea className="h-[300px]">
                              <TreeViewer
                                data={selectedAudit.after}
                                title="After"
                                variant="diff"
                              />
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="before" className="mt-4">
                      {selectedAudit.before ? (
                        <div className="border rounded-lg p-3">
                          <ScrollArea className="h-[400px]">
                            <TreeViewer
                              data={selectedAudit.before}
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
                      {selectedAudit.after ? (
                        <div className="border rounded-lg p-3">
                          <ScrollArea className="h-[400px]">
                            <TreeViewer
                              data={selectedAudit.after}
                              title="After State"
                            />
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

              {!hasChanges && (
                <div className="text-center text-muted-foreground py-8">
                  <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data changes recorded for this action</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DrawerComponent>
    </>
  );
}
