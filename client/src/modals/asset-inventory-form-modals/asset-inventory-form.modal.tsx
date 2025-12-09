// asset-inventory-form.tsx

'use client';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import FormTable from '@/components/customs/form-table/form-table';
import { Column } from '@/components/customs/form-table/form-table.interface';
import AssetPicker from './asset-picker';
import FormPreviewer from '@/components/customs/form-previewer';
import { FormModalProps } from '@/interfaces/shared.interface';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAssetInventoryFormLogic from './asset-inventory-form.logic';
import { Package, RotateCcw, Save, X, Loader2, Eye } from 'lucide-react';
import ImageModalViewer from '@/components/customs/image-modal-viewer';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface InventoryItemResponse {
  id: string;
  asset: { id: string };
  inventoryNo: string;
  status: string;
  qrCode: string | null;
  barCode: string | null;
  rfidTag: string | null;
  location: string | null;
}

const AssetInventoryFormModal: React.FC<FormModalProps> = ({
  open,
  close,
  onSuccess,
}) => {
  const {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleReset,
    formData,
    setFormData,
    selectedAsset,
    handleAssetSelect,
    inventoryItems,
    editingIndex,
    handleEditInventoryItem,
    handleDeleteInventoryItems,
    handleSaveEditedItem,
    handleCancelEdit,
    handleSaveDraft,
    loading,
    previewData,
    isFormValid,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
    remainingItem,
    totalGenerated,
  } = useAssetInventoryFormLogic(open, close, onSuccess);

  // state for image viewer
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);
  const [selectedInventoryNo, setSelectedInventoryNo] = useState<string>('');

  useEffect(() => {
    if (isConfirmed) {
      setIsConfirmed(false);
    }
  }, [selectedAsset, inventoryItems, formData]);

  // Define columns for FormTable
  const columns: Column<InventoryItemResponse>[] = [
    {
      key: 'inventoryNo',
      label: 'Inventory No',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {value}
        </span>
      ),
    },
    // { key: 'qrCode', label: 'QR Code' },
    {
      key: 'qrCode',
      label: 'QR Code',
      render: (value, row) =>
        value ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedQrCode(value);
              setImageViewerOpen(true);
              setSelectedInventoryNo(row.inventoryNo);
            }}
            className="gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
        ) : (
          '-'
        ),
    },
    { key: 'barCode', label: 'Bar Code' },
    { key: 'rfidTag', label: 'RFID Tag' },
    { key: 'location', label: 'Location' },
  ];

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleConfirmSubmit = () => {
    setShowPreview(false);
    setIsConfirmed(true);
    handleCancel();
  };

  const handleActionClick = () => {
    if (isConfirmed) {
      handleSaveDraft();
      setIsConfirmed(false);
    } else {
      handlePreview(); // open preview first
    }
  };

  const PreviewField = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between border-b border-border/30 pb-2 last:border-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-semibold text-right text-foreground">
        {value || '-'}
      </span>
    </div>
  );

  return (
    <>
      <Modal
        width="!max-w-[90vw]"
        open={open}
        close={() => openConfirm('close')}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create Asset Inventory</h2>
              <p className="text-sm text-muted-foreground">
                Generate and manage inventory items for selected asset
              </p>
            </div>
          </div>
        }
        footerChildren={
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => openConfirm('reset')}
              className="gap-2 cursor-pointer"
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </Button>
            {/* <Button
              type="button"
              onClick={handlePreview}
              size="lg"
              className="gap-2"
              disabled={!isFormValid || loading}
            >
              <Eye className="w-4 h-4" />
              Preview & Save Draft ({inventoryItems.length})
            </Button> */}

            <Button
              type="button"
              onClick={handleActionClick}
              size="lg"
              className="gap-2 cursor-pointer"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <Spinner className="w-5 h-5" />
              ) : isConfirmed ? (
                <>
                  <Eye className="w-4 h-4" />
                  Save
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </Button>
          </div>
        }
      >
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Asset Selection Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Select Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-2">
                  <Label>Choose an asset to generate inventory</Label>
                  <AssetPicker
                    value={selectedAsset}
                    onSelect={handleAssetSelect}
                  />
                  {selectedAsset && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Selected Asset:</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAsset.assetName} ({selectedAsset.assetNo})
                      </p>
                    </div>
                  )}
                  {selectedAsset && totalGenerated > 100 && (
                    <div className="mt-3 text-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-lg p-3">
                      <p className="font-semibold mb-1">
                        ⚠️ Inventory Generation Notice
                      </p>
                      <p>
                        Maximum generation per batch: <b>100 items</b>.
                        <br />
                        Modify and save as draft to generate the next batch.
                      </p>

                      {(totalGenerated > 0 || remainingItem > 0) && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>
                            <b>Total Quantity:</b> {totalGenerated}
                          </p>
                          <p>
                            <b>Remaining:</b> {remainingItem}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {loading && inventoryItems.length === 0 && selectedAsset && (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Generating inventory items...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Form Card - Only shown when editing */}
            {editingIndex !== null && (
              <Card className="border-indigo-200 dark:border-indigo-800">
                <CardHeader>
                  <CardTitle className="text-lg">Edit Inventory Item</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Update details for{' '}
                    {inventoryItems[editingIndex]?.inventoryNo}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSaveEditedItem} className="space-y-4">
                    <div className="">
                      {/* <div className="space-y-2">
                        <Label htmlFor="qrCode">QR Code</Label>
                        <Input
                          id="qrCode"
                          type="text"
                          placeholder="Enter QR code"
                          value={formData.qrCode || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, qrCode: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="barCode">Bar Code</Label>
                        <Input
                          id="barCode"
                          type="text"
                          placeholder="Enter bar code"
                          value={formData.barCode || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              barCode: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rfidTag">RFID Tag</Label>
                        <Input
                          id="rfidTag"
                          type="text"
                          placeholder="Enter RFID tag"
                          value={formData.rfidTag || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rfidTag: e.target.value,
                            })
                          }
                        />
                      </div> */}

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Textarea
                          id="location"
                          placeholder="Enter location"
                          value={formData.location || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* FormTable - Display all inventory items */}
            {inventoryItems.length > 0 && (
              <FormTable
                data={inventoryItems}
                columns={columns}
                onEdit={handleEditInventoryItem}
                onDelete={handleDeleteInventoryItems}
                getRowId={(row) => row.id}
                selectable={true}
                tableTitle="Generated Inventory Items"
                emptyMessage="No inventory items generated yet"
                pageSize={10}
              />
            )}
          </div>
        </ScrollArea>
      </Modal>

      {currentDialog && (
        <AlertDialog
          isOpen={true}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          title={currentDialog.title}
          description={currentDialog.description}
          isProceed={currentDialog.proceed}
          isCanceled={currentDialog.cancel}
          icon={currentDialog.icon}
        />
      )}

      <FormPreviewer
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleConfirmSubmit}
        headerTitle="Review Inventory Before Saving"
        description="Please review all inventory items before saving as draft."
        before={previewData.before}
        after={previewData.after}
        footerText="Confirm & Save Draft"
        disabled={!isFormValid}
      >
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {/* Asset Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Selected Asset
              </h3>
              <div className="p-5">
                <img
                  src={selectedAsset?.assetImage || '/images/asset-image.png'}
                  alt="QR Code"
                  className="w-full h-full border rounded-md object-contain bg-white"
                  onError={(e) => {
                    e.currentTarget.src = '/images/no-qrcode.png';
                  }}
                />
              </div>
              <PreviewField
                label="Asset Name"
                value={selectedAsset?.assetName}
              />
              <PreviewField label="Asset No" value={selectedAsset?.assetNo} />
            </div>

            {/* Inventory Items Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Inventory Items ({inventoryItems.length})
                </h3>
              </div>

              <div className="space-y-3">
                {inventoryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-muted/50 border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="font-medium text-sm mb-2">
                      Item {index + 1}: {item.inventoryNo}
                    </div>

                    {/* Code Images Section */}
                    <div className="flex flex-wrap gap-6">
                      {/* QR Code */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-muted-foreground mb-1">
                          QR Code
                        </span>
                        <img
                          src={item.qrCode || '/images/no-qrcode.png'}
                          alt="QR Code"
                          className="w-24 h-24 border rounded-md object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/images/no-qrcode.png';
                          }}
                        />
                      </div>

                      {/* Bar Code */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-muted-foreground mb-1">
                          Bar Code
                        </span>
                        <img
                          src={item.barCode || '/images/no-barcode.png'}
                          alt="Bar Code"
                          className="w-24 h-24 border rounded-md object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/images/no-barcode.png';
                          }}
                        />
                      </div>

                      {/* RFID Tag */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-muted-foreground mb-1">
                          RFID Tag
                        </span>
                        <img
                          src={item.rfidTag || '/images/no-rfid.png'}
                          alt="RFID Tag"
                          className="w-24 h-24 border rounded-md object-contain "
                          onError={(e) => {
                            e.currentTarget.src = '/images/no-rfid.png';
                          }}
                        />
                      </div>
                    </div>

                    <PreviewField label="Status" value={item.status || 'N/A'} />
                    <PreviewField
                      label="Location"
                      value={item.location || 'Not Specified'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </FormPreviewer>

      <ImageModalViewer
        imageViewerOpen={imageViewerOpen}
        imageViewerClose={() => {
          setImageViewerOpen(false);
          setSelectedQrCode(null);
        }}
        images={selectedQrCode ? [selectedQrCode] : []}
        isMulti={false}
        title="QR Code Viewer"
        downloadFileName={`${selectedInventoryNo}-qr-code.png`}
      />
    </>
  );
};

export default AssetInventoryFormModal;
