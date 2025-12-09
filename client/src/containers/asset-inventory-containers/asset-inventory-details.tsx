'use client';
import React, { useState } from 'react';
import DrawerComponent from '@/components/customs/drawer.component';
import ImageModalViewer from '@/components/customs/image-modal-viewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Hash,
  Database,
  Clock,
  History,
  ArrowRight,
  FileText,
  Wrench,
  Trash2,
  ArrowRightLeft,
  AlertTriangle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetInventoryInfo } from '@/interfaces/assets.interface';
import { formatDate } from '@syntaxsentinel/date-utils';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/utils/format-number.util';
import { Employee } from '@/modals/user-form-modals/user-form.interface';

interface LifecycleTransaction {
  id?: string;
  parNo?: string | null;
  transactionNo?: string;
  transactionType?: string;
  custodian?: Employee | null;
  fromStatus?: string;
  toStatus?: string;
  repairNo?: string | null;
  repairVendor?: string | null;
  repairCost?: number | null;
  repairDescription?: string | null;
  estimatedCompletionDate?: string | null;
  disposalNo?: string | null;
  disposalMethod?: string | null;
  disposalValue?: number | null;
  disposalVendor?: string | null;
  disposalCertificate?: string | null;
  transferNo?: string | null;
  transferFromLocation?: string | null;
  transferToLocation?: string | null;
  transferFromDepartment?: string | null;
  transferToDepartment?: string | null;
  incidentDate?: string | null;
  incidentDescription?: string | null;
  policeReportNumber?: string | null;
  insuranceClaimNumber?: string | null;
  approvalStatus?: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  remarks?: string | null;
  reason?: string | null;
  transactionDate?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  deletedAt?: string | null;
}

interface AssetInventoryDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: AssetInventoryInfo | null;
}

export default function AssetInventoryDetails({
  open,
  onOpenChange,
  inventory,
}: AssetInventoryDetailsProps) {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  if (!inventory) return null;

  const { asset, transactions = [] } = inventory;

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      request_issuance: 'Request Issuance',
      reject_issuance: 'Reject Issuance',
      direct_issuance: 'Direct Issuance',
      return: 'Return',
      transfer: 'Transfer',
      repair: 'Repair',
      disposal: 'Disposal',
      lost: 'Lost',
      stolen: 'Stolen',
    };
    return (
      labels[type] ||
      type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, any> = {
      request_issuance: FileText,
      reject_issuance: XCircle,
      direct_issuance: CheckCircle2,
      return: ArrowRightLeft,
      transfer: ArrowRightLeft,
      repair: Wrench,
      disposal: Trash2,
      lost: AlertTriangle,
      stolen: AlertTriangle,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getApprovalStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: any; label: string; color: string }
    > = {
      pending: {
        variant: 'secondary',
        label: 'Pending',
        color: 'bg-yellow-500',
      },
      approved: {
        variant: 'default',
        label: 'Approved',
        color: 'bg-green-500',
      },
      rejected: {
        variant: 'destructive',
        label: 'Rejected',
        color: 'bg-red-500',
      },
    };
    const config = variants[status] || {
      variant: 'outline',
      label: status,
      color: 'bg-gray-500',
    };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const renderTransactionDetails = (transaction: LifecycleTransaction) => {
    const details: { label: string; value: any }[] = [];

    // Common fields
    if (transaction.parNo)
      details.push({ label: 'PAR No', value: transaction.parNo });
    if (transaction.reason)
      details.push({ label: 'Reason', value: transaction.reason });
    if (transaction.remarks)
      details.push({ label: 'Remarks', value: transaction.remarks });

    // Repair details
    if (transaction.repairNo) {
      details.push({ label: 'Repair No', value: transaction.repairNo });
      if (transaction.repairVendor)
        details.push({
          label: 'Repair Vendor',
          value: transaction.repairVendor,
        });
      if (transaction.repairCost)
        details.push({
          label: 'Repair Cost',
          value: formatNumber(transaction.repairCost, {
            type: 'currency',
            locale: 'en-PH', // For Philippine Peso formatting
            currency: 'PHP', // Currency code
          }),
        });
      if (transaction.repairDescription)
        details.push({
          label: 'Repair Description',
          value: transaction.repairDescription,
        });
      if (transaction.estimatedCompletionDate)
        details.push({
          label: 'Est. Completion',
          value: formatDate.readableDateTime(
            transaction.estimatedCompletionDate,
          ),
        });
    }

    // Disposal details
    if (transaction.disposalNo) {
      details.push({ label: 'Disposal No', value: transaction.disposalNo });
      if (transaction.disposalMethod)
        details.push({
          label: 'Disposal Method',
          value: transaction.disposalMethod,
        });
      if (transaction.disposalValue)
        details.push({
          label: 'Disposal Value',
          value: `₱${transaction.disposalValue.toLocaleString()}`,
        });
      if (transaction.disposalVendor)
        details.push({
          label: 'Disposal Vendor',
          value: transaction.disposalVendor,
        });
      if (transaction.disposalCertificate)
        details.push({
          label: 'Certificate',
          value: (
            <a
              href={transaction.disposalCertificate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View
            </a>
          ),
        });
    }

    // Transfer details
    if (transaction.transferNo) {
      details.push({ label: 'Transfer No', value: transaction.transferNo });
      if (transaction.transferFromLocation || transaction.transferToLocation) {
        details.push({
          label: 'Location',
          value: `${transaction.transferFromLocation || 'N/A'} → ${
            transaction.transferToLocation || 'N/A'
          }`,
        });
      }
      if (
        transaction.transferFromDepartment ||
        transaction.transferToDepartment
      ) {
        details.push({
          label: 'Department',
          value: `${transaction.transferFromDepartment || 'N/A'} → ${
            transaction.transferToDepartment || 'N/A'
          }`,
        });
      }
    }

    // Incident details (Lost/Stolen)
    if (transaction.incidentDate) {
      details.push({
        label: 'Incident Date',
        value: formatDate.readableDateTime(transaction.incidentDate),
      });
      if (transaction.incidentDescription)
        details.push({
          label: 'Incident Description',
          value: transaction.incidentDescription,
        });
      if (transaction.policeReportNumber)
        details.push({
          label: 'Police Report',
          value: transaction.policeReportNumber,
        });
      if (transaction.insuranceClaimNumber)
        details.push({
          label: 'Insurance Claim',
          value: transaction.insuranceClaimNumber,
        });
    }

    // Approval details
    if (transaction.approvedAt)
      details.push({
        label: 'Approved At',
        value: formatDate.readableDateTime(transaction.approvedAt),
      });
    if (transaction.rejectedAt)
      details.push({
        label: 'Rejected At',
        value: formatDate.readableDateTime(transaction.rejectedAt),
      });
    if (transaction.rejectionReason)
      details.push({
        label: 'Rejection Reason',
        value: transaction.rejectionReason,
      });

    return details;
  };

  return (
    <>
      <DrawerComponent
        open={open}
        onOpenChange={onOpenChange}
        title="Inventory Details"
        description="View detailed information about this asset inventory"
        direction="bottom"
      >
        <div className="h-[75vh] flex flex-col">
          {/* Header */}
          <div className="mb-6 px-1">
            <div className="flex items-start gap-5">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg rounded-sm">
                  <AvatarImage
                    src={
                      asset.assetImage
                        ? asset.assetImage
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${asset.assetName}`
                    }
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {asset.assetName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {asset.isVerified && (
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded flex items-center justify-center ring-4 ring-background">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  {asset.assetName} - Inventory #{inventory.inventoryNo}
                </h2>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge
                    variant={asset.isVerified ? 'default' : 'secondary'}
                    className="shadow-sm"
                  >
                    {asset.isVerified ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5" /> Unverified
                      </span>
                    )}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    Status: {inventory.status}
                  </Badge>
                  {inventory.isDraft && (
                    <Badge variant="outline" className="font-mono text-xs">
                      Draft
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Tabs */}
          <Tabs defaultValue="overview" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-4 w-full h-11 bg-muted/40 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Hash className="h-4 w-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Database className="h-4 w-4 mr-2" /> Details
              </TabsTrigger>
              <TabsTrigger
                value="lifecycle"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <History className="h-4 w-4 mr-2" /> Lifecycle
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Clock className="h-4 w-4 mr-2" /> System
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4">
              <ScrollArea className="h-[calc(75vh-280px)]">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 px-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Inventory Information
                      </h3>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Location
                          </p>
                          <p className="font-medium">
                            {inventory.location || '—'}
                          </p>
                        </div>

                        {/* QR Code */}
                        {inventory.qrCode && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              QR Code
                            </p>
                            <div className="flex items-center gap-2">
                              <img
                                src={inventory.qrCode}
                                alt="QR Code"
                                className="h-10 w-10 object-contain border rounded"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setQrModalOpen(true)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Barcode
                          </p>
                          <p className="font-medium">
                            {inventory.barCode || '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            RFID Tag
                          </p>
                          <p className="font-medium">
                            {inventory.rfidTag || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-0 px-1">
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Asset Details
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Asset Number
                        </p>
                        <p className="font-medium">{asset.assetNo}</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Description
                        </p>
                        <p className="font-medium">{asset.assetDescription}</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Manufacturer
                        </p>
                        <p className="font-medium">{asset.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Lifecycle History Tab */}
                <TabsContent value="lifecycle" className="mt-0 px-1">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Transaction History
                    </h3>

                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No transaction history available</p>
                      </div>
                    ) : (
                      <div className="relative space-y-4">
                        {/* Timeline line */}
                        <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-border" />

                        {transactions.map((transaction, index) => {
                          const normalizedTransaction: LifecycleTransaction = {
                            ...transaction,
                            repairCost: transaction.repairCost
                              ? Number(transaction.repairCost)
                              : null,
                            disposalValue: transaction.disposalValue
                              ? Number(transaction.disposalValue)
                              : null,
                            version: transaction.version
                              ? Number(transaction.version)
                              : undefined,
                          };
                          const details = renderTransactionDetails(
                            normalizedTransaction,
                          );
                          return (
                            <div
                              key={transaction.id}
                              className="relative pl-12"
                            >
                              {/* Timeline dot */}
                              <div className="absolute left-0 top-3 w-11 h-11 rounded-full bg-background border-4 border-border flex items-center justify-center">
                                {getTransactionIcon(
                                  transaction.transactionType,
                                )}
                              </div>

                              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-sm">
                                        {getTransactionTypeLabel(
                                          transaction.transactionType,
                                        )}
                                      </h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-mono">
                                      Transaction No:{' '}
                                      {transaction.transactionNo}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                      Custodian:{' '}
                                      {transaction?.custodian
                                        ? [
                                            transaction.custodian.firstName,
                                            transaction.custodian.middleName,
                                            transaction.custodian.lastName,
                                          ]
                                            .filter(Boolean)
                                            .join(' ')
                                        : 'N/A'}
                                    </p>
                                  </div>
                                  <div className="text-right text-xs text-muted-foreground">
                                    <p>
                                      {formatDate.readableDateTime(
                                        transaction.transactionDate,
                                      )}
                                    </p>
                                    <p className="text-[10px]">
                                      {formatDate.readableDateTime(
                                        transaction.transactionDate,
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {/* Status Change */}
                                <div className="flex items-center gap-2 mb-3 p-2 bg-background/50 rounded">
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.fromStatus}
                                  </Badge>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.toStatus}
                                  </Badge>
                                </div>

                                {/* Additional Details */}
                                {details.length > 0 && (
                                  <div className="space-y-2 pt-2 border-t border-border/50">
                                    {details.map((detail, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2 text-xs"
                                      >
                                        <span className="text-muted-foreground font-medium min-w-[120px]">
                                          {detail.label}:
                                        </span>
                                        <span className="flex-1 break-words">
                                          {detail.value || '—'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* System Tab */}
                <TabsContent value="system" className="mt-0 px-1">
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">
                          UUID
                        </p>
                        <code className="text-sm font-mono break-all bg-muted px-3 py-1.5 rounded block">
                          {inventory.id}
                        </code>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Created At
                        </p>
                        <p className="font-medium">
                          {formatDate.readableDateTime(inventory.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DrawerComponent>

      {/* QR Code Modal */}
      {inventory.qrCode && (
        <ImageModalViewer
          imageViewerOpen={qrModalOpen}
          imageViewerClose={() => setQrModalOpen(false)}
          images={[inventory.qrCode]}
          isMulti={false}
          title="QR Code"
          downloadFileName={`inventory-${inventory.inventoryNo}-qr`}
        />
      )}
    </>
  );
}
