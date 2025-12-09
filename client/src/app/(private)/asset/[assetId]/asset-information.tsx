'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAssetInfo } from '@/api/protected/assets-api/asset.api';
import { AssetsInfo } from '@/interfaces/assets.interface';
import { extractErrorMessage } from '@/configs/api.helper';
import { formatDate } from '@syntaxsentinel/date-utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IoMdTrendingDown } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Briefcase,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  QrCode,
  PhilippinePeso,
  Eye,
  ShoppingCart,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ImageModalViewer from '@/components/customs/image-modal-viewer';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { formatNumber } from '@/lib/format-number.util';
import moment, { MomentInput } from 'moment';

interface AssetInformationComponentProps {
  assetId: string;
}

interface Inventory {
  id: string;
  inventoryNo: string;
  qrCode: string;
  barCode: string | null;
  rfidTag: string | null;
  location: string | null;
  isDraft: boolean;
  status: string;
  createdAt: string;
}

export default function AssetInformation({
  assetId,
}: AssetInformationComponentProps) {
  const [asset, setAsset] = useState<AssetsInfo | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const response = await getAssetInfo(assetId);
        setAsset(response.data);
        setInventories(response.data.inventories || []);
        showToastSuccess(
          'Asset information',
          'Data Loaded successfully',
          'top-center',
        );
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        console.error('Failed to fetch asset:', errorMessage);
        showToastError('Failed to fetch asset:', errorMessage, 'top-center');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [assetId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!asset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Not Found</CardTitle>
          <CardDescription>
            The asset with ID {assetId} could not be found.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isActive = !asset.deletedAt;
  const assetImageUrl =
    asset.assetImage ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${asset.assetName}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* <Avatar className="h-24 w-24 rounded-xl ring-2 ring-neutral-200 shadow">
            <AvatarImage
              src={asset.assetImage}
              alt={asset.assetName}
              className="object-cover rounded-xl"
            />
            <AvatarFallback className="bg-primary-600 text-white font-bold text-xl">
              {asset.assetName.charAt(0)}
            </AvatarFallback>
          </Avatar> */}
          {asset.assetImage ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setImageViewerOpen(true)}
                  >
                    <Avatar className="h-24 w-24 rounded-xl ring-2 ring-neutral-200 shadow">
                      <AvatarImage
                        src={asset.assetImage}
                        alt={asset.assetName}
                        className="object-cover rounded-xl"
                      />
                      <AvatarFallback className="bg-primary-600 text-white font-bold text-xl">
                        {asset.assetName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Click to view full image
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
          <div>
            <h1 className="text-3xl font-bold">{asset.assetName}</h1>
            <p className="text-muted-foreground">Asset No: {asset.assetNo}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">
                {inventories.length}{' '}
                {inventories.length === 1 ? 'Unit' : 'Units'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Asset Details</TabsTrigger>
          <TabsTrigger value="purchase-details">Purchase Details</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
          <TabsTrigger value="inventories">
            Inventories ({inventories.length})
          </TabsTrigger>
        </TabsList>

        {/* Asset Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Asset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-base">{asset.assetDescription}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Manufacturer
                  </p>
                  <p className="text-base">{asset.manufacturer}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <PhilippinePeso className="h-4 w-4" />
                    Asset Value
                  </p>
                  <p className="text-base font-semibold">
                    {formatNumber.currency(
                      (asset.acquisitionCost || 0) *
                        (asset.currentQuantity || 0),
                      'PHP',
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <PhilippinePeso className="h-4 w-4" />
                    Acquisition Cost
                  </p>
                  <p className="text-base font-semibold">
                    {/* ${asset.acquisitionCost.toLocaleString()} */}
                    {formatNumber.currency(asset.acquisitionCost, 'PHP')}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    Current Quantity
                  </p>
                  <p className="text-base font-semibold">
                    {asset.currentQuantity}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Acquisition Date
                  </p>
                  <p className="text-base">
                    {formatDate.shortDate(asset.acquisitionDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Warranty Date
                  </p>
                  <p className="text-base">
                    {formatDate.shortDate(asset.warrantyDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Verification Status
                  </p>
                  <Badge variant={asset.isVerified ? 'default' : 'secondary'}>
                    {asset.isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Approval Status
                  </p>
                  <Badge variant={asset.isApproved ? 'default' : 'secondary'}>
                    {asset.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </div>

              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {['Prepared', 'Finalized', 'Verified', 'Approved'].map(
                  (role) => {
                    const user = asset[`${role.toLowerCase()}By`];
                    return (
                      <div key={role} className="flex flex-col gap-1">
                        <p className="text-muted-foreground text-xs">
                          {role} By
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              user?.profileImage || '/images/default-avatar.jpg'
                            }
                            alt={user?.fullname || 'Unknown User'}
                            className="h-8 w-8 rounded-full"
                          />
                          <p className="font-medium">
                            {user?.fullname || 'Unknown User'}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created On</p>
                  <p className="font-medium">
                    {asset.createdAt
                      ? formatDate.readableDateTime(asset.createdAt)
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {asset.createdAt
                      ? formatDate.relativeTime(asset.createdAt)
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {asset.updatedAt
                      ? formatDate.readableDateTime(asset.updatedAt)
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {asset.updatedAt
                      ? formatDate.relativeTime(asset.updatedAt)
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Verified At</p>
                  <p className="font-medium">
                    {asset.verifiedAt
                      ? formatDate.readableDateTime(asset.verifiedAt)
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {asset.verifiedAt
                      ? formatDate.relativeTime(asset.verifiedAt)
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Approved At</p>
                  <p className="font-medium">
                    {asset.approvedAt
                      ? formatDate.readableDateTime(asset.approvedAt)
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {asset.approvedAt
                      ? formatDate.relativeTime(asset.approvedAt)
                      : 'N/A'}
                  </p>
                </div>

                <div></div>

                {asset.deletedAt && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Deleted On</p>
                    <p className="font-medium text-red-600">
                      {formatDate.readableDateTime(asset.deletedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate.relativeTime(asset.deletedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventories Tab */}
        <TabsContent value="inventories" className="space-y-4">
          {inventories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Inventories</h3>
                  <p className="text-muted-foreground">
                    No inventory items have been created for this asset yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventories.map((inventory) => (
                <Card
                  key={inventory.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold">
                          {inventory.inventoryNo}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {formatDate.relativeTime(inventory.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          inventory.status === 'New-Available'
                            ? 'default'
                            : 'secondary'
                        }
                        className="ml-2"
                      >
                        {inventory.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">QR Code:</span>
                      <span className="font-medium truncate">Available</span>
                    </div>

                    {inventory.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">
                          {inventory.location}
                        </span>
                      </div>
                    )}

                    {inventory.isDraft && (
                      <Badge
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Draft
                      </Badge>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Created:{' '}
                      {formatDate.readableDateTime(inventory.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Purchase Details Tab */}
        <TabsContent value="purchase-details" className="mt-0 px-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Purchase Order No.
                  </p>
                  <p className="text-base">{asset.purchaseOrderNo || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Supplier
                  </p>
                  <p className="text-base">{asset.supplier || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Supplier Contact No.
                  </p>
                  <p className="text-base">{asset.supplierContactNo || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Supplier Contact Email
                  </p>
                  <p className="text-base">
                    {asset.supplierContactEmail || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Purchase Date
                  </p>
                  <p className="text-base">
                    {formatDate.shortDate(asset.purchaseDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Delivery Date
                  </p>
                  <p className="text-base">
                    {formatDate.shortDate(asset.deliveryDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Acquisition Type
                  </p>
                  <p className="text-base">{asset.acquisitionType || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Invoice No.
                  </p>
                  <p className="text-base">{asset.invoiceNo || '—'}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <PhilippinePeso className="h-4 w-4" />
                    Invoice Amount
                  </p>
                  <p className="text-base font-semibold">
                    {asset.invoiceAmount
                      ? formatNumber.currency(asset.invoiceAmount, 'PHP')
                      : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Depreciation details*/}
        <TabsContent value="depreciation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IoMdTrendingDown className="h-5 w-5" />
                Asset Depreciation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {asset.depreciation ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Useful Life */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Useful Life
                      </p>
                      <p className="text-base">
                        {asset.depreciation.usefulLife}{' '}
                        {asset.depreciation.usefulLifeUnit.toLowerCase()}
                      </p>
                    </div>

                    {/* Salvage Value */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <PhilippinePeso className="h-4 w-4" />
                        Salvage Value
                      </p>
                      <p className="text-base font-semibold">
                        {formatNumber.currency(
                          asset.depreciation.salvageValue,
                          'PHP',
                        )}
                      </p>
                    </div>

                    {/* Depreciation Method */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Depreciation Method
                      </p>
                      <p className="text-base">
                        {asset.depreciation.depreciationMethod.replace(
                          '_',
                          ' ',
                        )}
                      </p>
                    </div>

                    {/* Frequency */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Frequency
                      </p>
                      <p className="text-base">
                        {asset.depreciation.frequency.toLowerCase()}
                      </p>
                    </div>

                    {/* First Depreciation Date */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        First Depreciation Date
                      </p>
                      <p className="text-base">
                        {formatDate.shortDate(
                          asset.depreciation.firstDepreciationDate,
                        )}
                      </p>
                    </div>

                    {/* Last Depreciation Date */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Last Depreciation Date
                      </p>
                      <p className="text-base">
                        {formatDate.shortDate(
                          asset.depreciation.lastDepreciationDate,
                        )}
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Verification Status
                      </p>
                      <Badge
                        variant={
                          asset.depreciation.isVerified
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {asset.depreciation.isVerified
                          ? 'Verified'
                          : 'Not Verified'}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Prepared / Verified Users */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {['Prepared', 'Verified'].map((role) => {
                      const user =
                        asset.depreciation[`${role.toLowerCase()}By`];
                      return (
                        <div key={role} className="flex flex-col gap-1">
                          <p className="text-muted-foreground text-xs">
                            {role} By
                          </p>
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                user?.profileImage ||
                                '/images/default-avatar.jpg'
                              }
                              alt={user?.fullname || 'Unknown User'}
                              className="h-8 w-8 rounded-full"
                            />
                            <p className="font-medium">
                              {user?.fullname || 'Unknown User'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />
                  {/* Compute latest depreciation summary */}
                  {/* Compute latest depreciation summary */}
                  {asset.depreciation &&
                    asset.depreciation.records.length > 0 &&
                    (() => {
                      const today = new Date();

                      // Filter out future records
                      const pastRecords = asset.depreciation.records.filter(
                        (r) => new Date(r.depreciationDate) <= today,
                      );

                      if (pastRecords.length === 0) return null; // No valid records yet

                      // Sort descending by date
                      const sortedRecords = pastRecords
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.depreciationDate).getTime() -
                            new Date(a.depreciationDate).getTime(),
                        );

                      const latestRecord = sortedRecords[0]; // latest as of today

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                          {/* Latest Depreciation Amount */}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Latest Depreciation Amount
                            </p>
                            <p className="text-base font-semibold">
                              {formatNumber.currency(
                                latestRecord.depreciationAmount,
                                'PHP',
                              )}
                            </p>
                          </div>

                          {/* Latest Net Book Value */}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Latest Net Book Value
                            </p>
                            <p className="text-base font-semibold">
                              {formatNumber.currency(
                                latestRecord.netBookValue,
                                'PHP',
                              )}
                            </p>
                          </div>

                          {/* Latest Accumulated Depreciation */}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Latest Accumulated Depreciation
                            </p>
                            <p className="text-base font-semibold">
                              {formatNumber.currency(
                                latestRecord.accumulatedDepreciation,
                                'PHP',
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                  <Separator />

                  {/* Depreciation Records Table */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                      Depreciation Schedule
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Detailed record of asset depreciation over time
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total schedules: {asset.depreciation.records.length}
                    </p>
                  </div>
                  <div className="overflow-x-auto h-56">
                    <table className="w-full table-auto border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted text-muted-foreground">
                          <th className="px-4 py-2 text-left">Year</th>
                          <th className="px-4 py-2 text-left">Month</th>
                          <th className="px-4 py-2 text-left">
                            Depreciation Date
                          </th>
                          <th className="px-4 py-2 text-right">Amount</th>
                          <th className="px-4 py-2 text-right">
                            Net Book Value
                          </th>
                          <th className="px-4 py-2 text-right">
                            Accumulated Depreciation
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {asset.depreciation.records.map((record) => ( */}
                        {asset.depreciation.records
                          .slice() // clone array so original isn't mutated
                          .sort((a, b) =>
                            moment(a.depreciationDate).diff(
                              moment(b.depreciationDate),
                            ),
                          )
                          .map((record) => (
                            <tr
                              key={record.id}
                              className="border-t border-border"
                            >
                              <td className="px-4 py-2">{record.year}</td>
                              <td className="px-4 py-2">{record.month}</td>
                              <td className="px-4 py-2">
                                {formatDate.shortDate(record.depreciationDate)}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {formatNumber.currency(
                                  record.depreciationAmount,
                                  'PHP',
                                )}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {formatNumber.currency(
                                  record.netBookValue,
                                  'PHP',
                                )}
                              </td>
                              <td className="px-4 py-2 text-right">
                                {formatNumber.currency(
                                  record.accumulatedDepreciation,
                                  'PHP',
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No information yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ImageModalViewer
        imageViewerOpen={imageViewerOpen}
        imageViewerClose={() => setImageViewerOpen(false)}
        images={[assetImageUrl]}
        isMulti={false}
        title={`${asset.assetName} - Image`}
        downloadFileName={`${asset.assetNo}-${asset.assetName}`}
      />
    </div>
  );
}
