'use client';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Hash,
  Eye,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DrawerComponent from '@/components/customs/drawer.component';
import ImageModalViewer from '@/components/customs/image-modal-viewer';
import { AssetsInfo } from '@/interfaces/assets.interface';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/lib/format-number.util';
import { useRouter } from 'next/navigation';

interface AssetDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetsInfo | null;
}

export default function AssetDetails({
  open,
  onOpenChange,
  asset,
}: AssetDetailsProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const router = useRouter();

  if (!asset) return null;

  const assetImageUrl =
    asset.assetImage ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${asset.assetName}`;

  return (
    <>
      <DrawerComponent
        open={open}
        onOpenChange={onOpenChange}
        title="Asset Details"
        description="View detailed information about this asset"
        direction="bottom"
      >
        <div className="h-[75vh] flex flex-col">
          <div className="mb-6 px-1">
            <div className="flex items-start gap-5">
              <div className="relative group">
                {asset.assetImage ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative cursor-pointer"
                          onClick={() => setImageViewerOpen(true)}
                        >
                          <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg rounded-sm transition-all group-hover:ring-primary/50">
                            <AvatarImage src={asset.assetImage} />
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {asset.assetName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Hover Overlay with Eye Icon */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-sm flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Click to view full image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg rounded-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${asset.assetName}`}
                    />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {asset.assetName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {asset.isVerified && (
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded flex items-center justify-center ring-4 ring-background z-10">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  {asset.assetName}
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
                  <Badge variant="outline" className="font-mono">
                    v{asset.version}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    {asset.assetNo}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => router.push(`/asset/${asset.assetNo}`)}
                  className="px-4 py-2 bg-indigo-900 text-white rounded-md hover:bg-indigo-600 transition cursor-pointer"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <Tabs defaultValue="overview" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-4 w-full h-11 bg-muted/40 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Hash className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Database className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger
                value="purchase-details"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Clock className="h-4 w-4 mr-2" />
                Purchase Details
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <Clock className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4">
              <ScrollArea className="h-[calc(75vh-280px)]">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 px-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Asset Information
                      </h3>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Asset Number
                            </p>
                            <p className="font-medium">{asset.assetNo}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Description
                            </p>
                            <p className="font-medium">
                              {asset.assetDescription}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Manufacturer
                            </p>
                            <p className="font-medium">{asset.manufacturer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-0 px-1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Acquisition Details
                      </h3>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Asset Value
                            </p>
                            <p className="font-medium">
                              {formatNumber.currency(
                                (asset.acquisitionCost || 0) *
                                  (asset.currentQuantity || 0),
                                'PHP',
                              )}
                            </p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Acquisition Cost
                            </p>
                            <p className="font-medium">
                              {formatNumber.currency(
                                asset.acquisitionCost,
                                'PHP',
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Current Quantity
                            </p>
                            <p className="font-medium">
                              {asset.currentQuantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Acquisition Date
                            </p>
                            <p className="font-medium">
                              {formatDate.shortDate(asset.acquisitionDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Warranty Date
                            </p>
                            <p className="font-medium">
                              {formatDate.shortDate(asset.warrantyDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Purchase Details Tab */}
                <TabsContent value="purchase-details" className="mt-0 px-1">
                  <div className="space-y-6">
                    <div>
                      <div className="grid gap-3">
                        {/* Purchase Information */}
                        <div className="pt-4 border-t border-border/50">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Purchase Information
                          </h4>

                          <div className="grid gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  Purchase Order No.
                                </p>
                                <p className="font-medium">
                                  {asset.purchaseOrderNo || '—'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  Supplier
                                </p>
                                <p className="font-medium">
                                  {asset.supplier || '—'}
                                </p>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">
                                    Supplier Contact No.
                                  </p>
                                  <p className="font-medium">
                                    {asset.supplierContactNo || '—'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">
                                    Supplier Contact Email
                                  </p>
                                  <p className="font-medium">
                                    {asset.supplierContactEmail || '—'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">
                                    Purchase Date
                                  </p>
                                  <p className="font-medium">
                                    {formatDate.shortDate(asset.purchaseDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">
                                    Delivery Date
                                  </p>
                                  <p className="font-medium">
                                    {formatDate.shortDate(asset.deliveryDate)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">
                                    Acquisition Type
                                  </p>
                                  <p className="font-medium">
                                    {asset.acquisitionType || '—'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-muted-foreground mb-0.5">
                                    Invoice No.
                                  </p>
                                  <p className="font-medium">
                                    {asset.invoiceNo || '—'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  Invoice Amount
                                </p>
                                <p className="font-medium">
                                  {asset.invoiceAmount
                                    ? formatNumber.currency(
                                        asset.invoiceAmount,
                                        'PHP',
                                      )
                                    : '—'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* System Tab */}
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
                            {asset.id}
                          </code>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-0.5">
                                Version
                              </p>
                              <Badge variant="outline" className="font-mono">
                                v{asset.version}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-0.5">
                                Deleted At
                              </p>
                              <p className="font-medium text-sm">
                                {asset.deletedAt
                                  ? formatDate.readableDateTime(asset.deletedAt)
                                  : '—'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Last Updated
                            </p>
                            <p className="font-medium">
                              {formatDate.readableDateTime(asset.updatedAt)}
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

      {/* Image Modal Viewer */}
      <ImageModalViewer
        imageViewerOpen={imageViewerOpen}
        imageViewerClose={() => setImageViewerOpen(false)}
        images={[assetImageUrl]}
        isMulti={false}
        title={`${asset.assetName} - Image`}
        downloadFileName={`${asset.assetNo}-${asset.assetName}`}
      />
    </>
  );
}
