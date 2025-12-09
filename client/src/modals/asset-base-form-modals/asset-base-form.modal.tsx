// Updated AssetBaseFormModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import useAssetBaseFormLogic from './asset-base-form.logic';
import { FormModalProps } from '@/interfaces/shared.interface';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFormattedInput } from '@/hooks/useFormattedInput';
import { DatePicker } from '@/components/customs/date-picker';
import FormPreviewer from '@/components/customs/form-previewer';
import { formatDate } from '@syntaxsentinel/date-utils';
import { formatNumber } from '@/lib/format-number.util';
import SingleImageUploader from '@/components/customs/single-image-uploader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PreviewField } from '@/components/customs/preview-field';
import {
  FormContainer,
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import {
  Package,
  FileText,
  Factory,
  DollarSign,
  Hash,
  Calendar,
  Shield,
  RotateCcw,
  Eye,
  PhilippinePeso,
  Paperclip,
} from 'lucide-react';
import AssetNoGenerator from './asset_no_generator';

const AssetBaseFormModal: React.FC<FormModalProps> = ({
  open,
  close,
  mode = 'add',
  onSuccess,
  initialData = null,
}) => {
  const {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleSubmit,
    handleReset,
    formData,
    setFormData,
    handleChange,
    handleNumericChange,
    previewData,
    isFormValid,
    hasChanges,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
  } = useAssetBaseFormLogic(open, close, mode, initialData, onSuccess);

  useEffect(() => {
    if (isConfirmed) {
      setIsConfirmed(false);
    }
  }, [formData]);

  const acquisitionCostInput = useFormattedInput({
    name: 'acquisitionCost',
    value: formData.acquisitionCost,
    onChange: handleNumericChange,
    formatOptions: {
      type: 'currency',
      currency: 'PHP',
      locale: 'en-PH',
    },
  });

  const invoiceAmountCostInput = useFormattedInput({
    name: 'invoiceAmount',
    value: formData.invoiceAmount,
    onChange: handleNumericChange,
    formatOptions: {
      type: 'currency',
      currency: 'PHP',
      locale: 'en-PH',
    },
  });

  const currentQuantityInput = useFormattedInput({
    name: 'currentQuantity',
    value: formData.currentQuantity,
    onChange: handleNumericChange,
    formatOptions: {
      type: 'number',
    },
  });

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
      handleSubmit(true); // proceed with actual submission
      setIsConfirmed(false);
    } else {
      handlePreview(); // open preview first
    }
  };

  return (
    <>
      <Modal
        width="!max-w-[80vw]"
        open={open}
        close={() => openConfirm('close')}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {mode === 'edit' ? 'Edit Asset Record' : 'Create New Asset'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit'
                  ? 'Update existing asset information'
                  : 'Add a new asset to your inventory'}
              </p>
            </div>
          </div>
        }
        footerChildren={
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => openConfirm('reset')}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </Button>
            {/* <Button
              type="button"
              onClick={handlePreview}
              size="lg"
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {mode === 'edit' ? 'Preview & Update' : 'Preview & Create'}
            </Button> */}
            <Button
              type="button"
              onClick={handleActionClick}
              size="lg"
              className="gap-2"
            >
              {isConfirmed ? (
                <>
                  <Eye className="w-4 h-4" />
                  {mode === 'edit' ? 'Save Changes' : 'Save Asset'}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  {mode === 'edit' ? 'Preview & Update' : 'Preview & Create'}
                </>
              )}
            </Button>
          </div>
        }
      >
        <form id="form" onSubmit={handleSubmit} className="p-6">
          <FormContainer>
            {/* Image upload */}
            <FormSection
              title="Asset Image"
              description="Upload an image of the asset"
              icon={<Package className="w-4 h-4" />}
            >
              <FormGrid columns={1}>
                <FormField
                  label="Asset Image"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Upload a clear image of the asset (optional)"
                  fullWidth
                >
                  <SingleImageUploader
                    key={formData.assetImage || 'no-image'}
                    value={formData.assetImage}
                    onChange={(base64OrNull) => {
                      setFormData((prev) => ({
                        ...prev,
                        assetImage: base64OrNull || '',
                      }));
                    }}
                    valueType="base64"
                    maxSizeMB={5}
                  />
                </FormField>
              </FormGrid>
            </FormSection>
            {/* Asset Information Section */}
            <FormSection
              title="Asset Information"
              description="Core details and identification"
              icon={<Package className="w-4 h-4" />}
            >
              <FormGrid columns={2}>
                <FormField
                  label="Asset Number"
                  icon={<Hash className="w-4 h-4" />}
                  required
                  helper="Unique identifier for tracking"
                >
                  {/* <Input
                    id="assetNo"
                    name="assetNo"
                    value={formData.assetNo}
                    onChange={handleChange}
                    placeholder="e.g., AST-2024-001"
                    className="h-11"
                    required
                  /> */}
                  <AssetNoGenerator
                    value={formData.assetNo}
                    onChange={(newNo) =>
                      setFormData((prev) => ({ ...prev, assetNo: newNo }))
                    }
                    mode={mode}
                  />
                </FormField>

                <FormField
                  label="Asset Name"
                  icon={<FileText className="w-4 h-4" />}
                  required
                  helper="Display name for the asset"
                >
                  <Input
                    id="assetName"
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleChange}
                    placeholder="e.g., Dell Laptop XPS 15"
                    className="h-11"
                    required
                  />
                </FormField>

                <FormField
                  label="Asset Description"
                  icon={<FileText className="w-4 h-4" />}
                  required
                  fullWidth
                  helper="Detailed description of the asset"
                >
                  <Textarea
                    id="assetDescription"
                    name="assetDescription"
                    value={formData.assetDescription}
                    onChange={handleChange}
                    placeholder="Provide a comprehensive description..."
                    className="min-h-[100px] resize-none"
                    required
                  />
                </FormField>

                <FormField
                  label="Manufacturer"
                  icon={<Factory className="w-4 h-4" />}
                  required
                  fullWidth
                  helper="Manufacturing details and brand information"
                >
                  <Textarea
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="Enter manufacturer information..."
                    className="min-h-[100px] resize-none"
                    required
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            {/* Financial & Inventory Section */}
            <FormSection
              title="Financial & Inventory"
              description="Cost, quantity, and date information"
              icon={<DollarSign className="w-4 h-4" />}
            >
              <FormGrid columns={2}>
                <FormField
                  label="Acquisition Cost"
                  icon={<PhilippinePeso className="w-4 h-4" />}
                  required
                  helper="Purchase price in Philippine Peso"
                >
                  <Input
                    id="acquisitionCost"
                    {...acquisitionCostInput.inputProps}
                    placeholder="₱ 0.00"
                    className="h-11"
                    required
                  />
                </FormField>

                <FormField
                  label="Current Quantity"
                  icon={<Hash className="w-4 h-4" />}
                  required
                  helper="Number of units available"
                >
                  <Input
                    id="currentQuantity"
                    {...currentQuantityInput.inputProps}
                    placeholder="0"
                    className="h-11"
                    required
                  />
                </FormField>

                <FormField
                  label="Acquisition Date"
                  icon={<Calendar className="w-4 h-4" />}
                  required
                  helper="Date of acquisition"
                >
                  <DatePicker
                    name="acquisitionDate"
                    value={formData.acquisitionDate}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, acquisitionDate: val }))
                    }
                    required
                  />
                </FormField>

                <FormField
                  label="Warranty Expiration"
                  icon={<Shield className="w-4 h-4" />}
                  required
                  helper="End date of warranty coverage"
                >
                  <DatePicker
                    name="warrantyDate"
                    value={formData.warrantyDate}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, warrantyDate: val }))
                    }
                    required
                  />
                </FormField>
              </FormGrid>
            </FormSection>
            <FormSection
              title="Purchase Information"
              description="Purchase Order No, Supplier, Invoice and date information (optional)"
              icon={<Paperclip className="w-4 h-4" />}
            >
              <FormGrid columns={2}>
                <FormField
                  label="Purchase Order No"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Purchase Order No"
                >
                  <Input
                    id="purchaseOrderNo"
                    name="purchaseOrderNo"
                    value={formData.purchaseOrderNo}
                    onChange={handleChange}
                    placeholder="..."
                    className="h-11"
                  />
                </FormField>
                <FormField
                  label="Supplier Name"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Who is the Supplier of the Asset"
                >
                  <Input
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Input name"
                    className="h-11"
                  />
                </FormField>
                <FormField
                  label="Supplier Contact No"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Contact No of Supplier"
                >
                  <Input
                    id="supplierContactNo"
                    name="supplierContactNo"
                    value={formData.supplierContactNo}
                    onChange={handleChange}
                    placeholder="mobile or telephone no"
                    className="h-11"
                  />
                </FormField>
                <FormField
                  label="Supplier Contact Email"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Email Address of Supplier"
                >
                  <Input
                    id="supplierContactEmail"
                    name="supplierContactEmail"
                    value={formData.supplierContactEmail}
                    onChange={handleChange}
                    placeholder="e.g., supplier@mail.com"
                    className="h-11"
                    type="email"
                  />
                </FormField>
                <FormField
                  label="Purchase Date"
                  icon={<Calendar className="w-4 h-4" />}
                  helper="Date of purchase"
                >
                  <DatePicker
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, purchaseDate: val }))
                    }
                  />
                </FormField>
                <FormField
                  label="Delivery Date"
                  icon={<Calendar className="w-4 h-4" />}
                  helper="Date of Delivered of asset"
                >
                  <DatePicker
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, deliveryDate: val }))
                    }
                  />
                </FormField>
                <FormField
                  label="Acquisition Type"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Acquisition Type"
                >
                  <Input
                    id="acquisitionType"
                    name="acquisitionType"
                    value={formData.acquisitionType}
                    onChange={handleChange}
                    placeholder="e.g., Purchase, Self-Constructed Assets, Lease, Donation etc."
                    className="h-11"
                  />
                </FormField>
                <FormField
                  label="Invoice Amount"
                  icon={<PhilippinePeso className="w-4 h-4" />}
                  helper="Invoice Amount in Philippine Peso (including shipping, installation, etc.) "
                >
                  <Input
                    id="invoiceAmount"
                    {...invoiceAmountCostInput.inputProps}
                    placeholder="₱ 0.00"
                    className="h-11"
                  />
                </FormField>
                <FormField
                  label="Invoice No"
                  icon={<FileText className="w-4 h-4" />}
                  helper="Invoice No"
                >
                  <Input
                    id="invoiceNo"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleChange}
                    placeholder="Invoice No."
                    className="h-11"
                  />
                </FormField>
              </FormGrid>
            </FormSection>
          </FormContainer>
        </form>
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
        headerTitle={
          mode === 'edit'
            ? 'Review Changes Before Updating'
            : 'Review Asset Before Creation'
        }
        description={
          mode === 'edit'
            ? 'Compare the previous and updated asset details before proceeding.'
            : 'Please review the details before creating this asset.'
        }
        before={previewData.before}
        after={previewData.after}
        footerText={mode === 'edit' ? 'Confirm Update' : 'Confirm Create'}
        disabled={mode === 'edit' ? !hasChanges : !isFormValid}
      >
        <ScrollArea>
          <div className="h-full overflow-auto">
            <div className="grid grid-cols-1 gap-6">
              {mode === 'edit' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      Previous Values
                    </h3>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    {initialData?.assetImage && (
                      <div className="flex flex-col items-center mb-4 pb-4 border-b border-border/30">
                        <span className="text-sm text-muted-foreground font-medium mb-2">
                          Previous Asset Image
                        </span>
                        <img
                          src={initialData.assetImage}
                          alt="Previous Asset"
                          className="w-full h-full object-cover rounded-lg border border-primary/30 shadow-sm"
                        />
                      </div>
                    )}
                    <PreviewField
                      label="Asset No"
                      value={initialData?.assetNo}
                    />
                    <PreviewField
                      label="Asset Name"
                      value={initialData?.assetName}
                    />
                    <PreviewField
                      label="Description"
                      value={initialData?.assetDescription}
                    />
                    <PreviewField
                      label="Manufacturer"
                      value={initialData?.manufacturer}
                    />
                    <PreviewField
                      label="Acquisition Cost"
                      value={formatNumber.currency(
                        initialData?.acquisitionCost,
                        'PHP',
                      )}
                    />
                    <PreviewField
                      label="Current Quantity"
                      value={formatNumber.withCommas(
                        initialData?.currentQuantity,
                      )}
                    />
                    <PreviewField
                      label="Acquisition Date"
                      value={formatDate.shortDate(initialData?.acquisitionDate)}
                    />
                    <PreviewField
                      label="Warranty Date"
                      value={formatDate.shortDate(initialData?.warrantyDate)}
                    />

                    <PreviewField
                      label="Purchase Order No"
                      value={initialData?.purchaseOrderNo}
                    />
                    <PreviewField
                      label="Supplier"
                      value={initialData?.supplier}
                    />
                    <PreviewField
                      label="Supplier Contact No"
                      value={initialData?.supplierContactNo}
                    />
                    <PreviewField
                      label="Supplier Contact Email"
                      value={initialData?.supplierContactEmail}
                    />
                    <PreviewField
                      label="Purchase Date"
                      value={
                        initialData?.purchaseDate
                          ? formatDate.shortDate(initialData.purchaseDate)
                          : 'N/A'
                      }
                    />
                    <PreviewField
                      label="Delivery Date"
                      value={
                        initialData?.deliveryDate
                          ? formatDate.shortDate(initialData.deliveryDate)
                          : 'N/A'
                      }
                    />
                    <PreviewField
                      label="Acquisition Type"
                      value={initialData?.acquisitionType}
                    />
                    <PreviewField
                      label="Invoice No"
                      value={initialData?.invoiceNo}
                    />
                    <PreviewField
                      label="Invoice Amount"
                      value={formatNumber.currency(
                        initialData?.invoiceAmount,
                        'PHP',
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {mode === 'edit' ? 'New Values' : 'Asset Details'}
                  </h3>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  {formData.assetImage && (
                    <div className="flex flex-col items-center mb-4 pb-4 border-b border-primary/20">
                      <span
                        className={`text-sm font-medium mb-2 ${
                          formData.assetImage !== initialData?.assetImage
                            ? 'text-blue-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {mode === 'edit' ? 'New Asset Image' : 'Asset Image'}
                      </span>
                      <img
                        src={formData.assetImage}
                        alt="Asset Preview"
                        className="w-full h-full object-cover rounded-lg border border-primary/30 shadow-sm"
                      />
                    </div>
                  )}
                  <PreviewField
                    label="Asset No"
                    value={formData.assetNo}
                    changed={formData.assetNo !== initialData?.assetNo}
                  />
                  <PreviewField
                    label="Asset Name"
                    value={formData.assetName}
                    changed={formData.assetName !== initialData?.assetName}
                  />
                  <PreviewField
                    label="Description"
                    value={formData.assetDescription}
                    changed={
                      formData.assetDescription !==
                      initialData?.assetDescription
                    }
                  />
                  <PreviewField
                    label="Manufacturer"
                    value={formData.manufacturer}
                    changed={
                      formData.manufacturer !== initialData?.manufacturer
                    }
                  />
                  <PreviewField
                    label="Acquisition Cost"
                    value={formatNumber.currency(
                      formData.acquisitionCost,
                      'PHP',
                    )}
                    changed={
                      formData.acquisitionCost !== initialData?.acquisitionCost
                    }
                  />
                  <PreviewField
                    label="Current Quantity"
                    value={formatNumber.withCommas(formData.currentQuantity)}
                    changed={
                      formData.currentQuantity !== initialData?.currentQuantity
                    }
                  />
                  <PreviewField
                    label="Acquisition Date"
                    value={formatDate.shortDate(formData.acquisitionDate)}
                    changed={
                      formData.acquisitionDate !== initialData?.acquisitionDate
                    }
                  />
                  <PreviewField
                    label="Warranty Date"
                    value={formatDate.shortDate(formData.warrantyDate)}
                    changed={
                      formData.warrantyDate !== initialData?.warrantyDate
                    }
                  />
                  <PreviewField
                    label="Purchase Order No"
                    value={formData.purchaseOrderNo}
                    changed={
                      formData.purchaseOrderNo !== initialData?.purchaseOrderNo
                    }
                  />
                  <PreviewField
                    label="Supplier"
                    value={formData.supplier}
                    changed={formData.supplier !== initialData?.supplier}
                  />
                  <PreviewField
                    label="Supplier Contact No"
                    value={formData.supplierContactNo}
                    changed={
                      formData.supplierContactNo !==
                      initialData?.supplierContactNo
                    }
                  />
                  <PreviewField
                    label="Supplier Contact Email"
                    value={formData.supplierContactEmail}
                    changed={
                      formData.supplierContactEmail !==
                      initialData?.supplierContactEmail
                    }
                  />
                  <PreviewField
                    label="Purchase Date"
                    value={formatDate.shortDate(formData.purchaseDate)}
                    changed={
                      formData.purchaseDate !== initialData?.purchaseDate
                    }
                  />
                  <PreviewField
                    label="Delivery Date"
                    value={formatDate.shortDate(formData.deliveryDate)}
                    changed={
                      formData.deliveryDate !== initialData?.deliveryDate
                    }
                  />
                  <PreviewField
                    label="Acquisition Type"
                    value={formData.acquisitionType}
                    changed={
                      formData.acquisitionType !== initialData?.acquisitionType
                    }
                  />
                  <PreviewField
                    label="Invoice No"
                    value={formData.invoiceNo}
                    changed={formData.invoiceNo !== initialData?.invoiceNo}
                  />
                  <PreviewField
                    label="Invoice Amount"
                    value={formatNumber.currency(formData.invoiceAmount, 'PHP')}
                    changed={
                      formData.invoiceAmount !== initialData?.invoiceAmount
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </FormPreviewer>
    </>
  );
};

export default AssetBaseFormModal;
