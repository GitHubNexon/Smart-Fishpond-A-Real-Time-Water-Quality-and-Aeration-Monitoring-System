'use client';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  BanknoteArrowDown,
  Hourglass,
  PlayCircle,
  Flag,
  Repeat,
  Sigma,
} from 'lucide-react';
import {
  UsefulLifeUnit,
  DepreciationFrequency,
  DepreciationMethod,
} from '@/interfaces/assets-depreciation.api.interface';
import {
  formatUsefulLifeUnit,
  formatDepreciationFrequency,
  formatDepreciationMethod,
} from './asset-depreciation.helper';
import useAssetDepreciationFormLogic from './asset-depreciation.form.logic';
import VerifiedAssetPicker from './asset-picker-verified';

const AssetDeprecitionFormModal: React.FC<FormModalProps> = ({
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
    validateConfiguration,
  } = useAssetDepreciationFormLogic(open, close, mode, initialData, onSuccess);

  useEffect(() => {
    if (isConfirmed) {
      setIsConfirmed(false);
    }
  }, [formData]);

  const salvageValueInput = useFormattedInput({
    name: 'salvageValue',
    value: formData.salvageValue,
    onChange: handleNumericChange,
    formatOptions: {
      type: 'currency',
      currency: 'PHP',
      locale: 'en-PH',
    },
  });

  const usefulLifeInput = useFormattedInput({
    name: 'usefulLife',
    value: formData.usefulLife,
    onChange: handleNumericChange,
    formatOptions: {
      type: 'number',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
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
    if (!validateConfiguration()) return;
    if (isConfirmed) {
      handleSubmit(true);
      setIsConfirmed(false);
    } else {
      handlePreview();
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
              <BanknoteArrowDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {mode === 'edit'
                  ? 'Edit Asset Depreciation'
                  : 'Create New Asset Depreciation'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit'
                  ? 'Update existing asset Depreciation'
                  : 'Add a new Asset Depreciation'}
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
            <Button
              type="button"
              onClick={handleActionClick}
              size="lg"
              className="gap-2"
            >
              {isConfirmed ? (
                <>
                  <Eye className="w-4 h-4" />
                  {mode === 'edit' ? 'Save Changes' : 'Save'}
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
            <FormSection
              title="Depreciation Information"
              description="Core details"
              icon={<BanknoteArrowDown className="w-4 h-4" />}
            >
              <div
                className={`space-y-2 ${
                  mode === 'edit' ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <Label>Choose an asset to generate inventory</Label>
                <VerifiedAssetPicker
                  value={formData.asset}
                  onSelect={(ass) =>
                    setFormData((prev) => ({
                      ...prev,
                      asset: ass,
                    }))
                  }
                />
              </div>
              <FormGrid columns={3}>
                <FormField
                  label="UseFul Life"
                  icon={<Hourglass className="w-4 h-4" />}
                  required
                  helper="Expected lifespan of the asset (e.g., 5 years)"
                >
                  <Input
                    id="usefulLife"
                    {...usefulLifeInput.inputProps}
                    placeholder="0"
                    className="h-9"
                    required
                  />
                </FormField>
                <FormField
                  label="Useful Life Unit"
                  icon={<Calendar className="w-4 h-4" />}
                  required
                  helper="Select whether the useful life is measured in years or months"
                >
                  <Select
                    value={formData.usefulLifeUnit}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: 'usefulLifeUnit', value },
                      } as any)
                    }
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UsefulLifeUnit.YEARS}>
                        Years
                      </SelectItem>
                      <SelectItem value={UsefulLifeUnit.MONTHS}>
                        Months
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField
                  label="Salvage Value"
                  icon={<PhilippinePeso className="w-4 h-4" />}
                  required
                  helper="Estimated residual value of the asset after its useful life (in PHP)"
                >
                  <Input
                    id="salvageValueInput"
                    {...salvageValueInput.inputProps}
                    placeholder="₱ 0.00"
                    className="h-9"
                    required
                  />
                </FormField>
              </FormGrid>
              <FormGrid columns={3}>
                <FormField
                  label="First Depreciation Date"
                  icon={<Calendar className="w-4 h-4" />}
                  required
                  helper="Date when depreciation begins for the asset"
                >
                  <DatePicker
                    name="firstDepreciationDate"
                    value={formData.firstDepreciationDate}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstDepreciationDate: val,
                      }))
                    }
                    required
                  />
                </FormField>
                <FormField
                  label="Depreciation Frequency"
                  icon={<Calendar className="w-4 h-4" />}
                  required
                  helper="Set how often depreciation is applied (monthly, quarterly, or annually)."
                >
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: 'frequency', value },
                      } as any)
                    }
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DepreciationFrequency.MONTHLY}>
                        Monthly
                      </SelectItem>
                      <SelectItem value={DepreciationFrequency.QUARTERLY}>
                        Quarterly
                      </SelectItem>
                      <SelectItem value={DepreciationFrequency.ANNUAL}>
                        Annual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField
                  label="Depreciation Method"
                  icon={<Calendar className="w-4 h-4" />}
                  required
                  helper="Select how depreciation is calculated — straight-line or accelerated."
                >
                  <Select
                    value={formData.depreciationMethod}
                    onValueChange={(value) =>
                      handleChange({
                        target: { name: 'depreciationMethod', value },
                      } as any)
                    }
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DepreciationMethod.STRAIGHT_LINE}>
                        Straight line
                      </SelectItem>
                      <SelectItem value={DepreciationMethod.ACCELERATED}>
                        Accelerated
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
            : 'Review Depreciation Before Creation'
        }
        description={
          mode === 'edit'
            ? 'Compare the previous and updated depreciation details before proceeding.'
            : 'Please review the details before creating this asset depreciation.'
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
                      <BanknoteArrowDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      Previous Values
                    </h3>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <PreviewField
                      label="Useful Life"
                      value={formatNumber.withCommas(initialData?.usefulLife)}
                    />
                    <PreviewField
                      label="Useful Life Unit"
                      value={formatUsefulLifeUnit(initialData?.usefulLifeUnit)}
                    />
                    <PreviewField
                      label="Salvage Value"
                      value={formatNumber.currency(
                        initialData?.salvageValue,
                        'PHP',
                      )}
                    />
                    <PreviewField
                      label="First Depreciation Date"
                      value={formatDate.shortDate(
                        initialData?.firstDepreciationDate,
                      )}
                    />
                    <PreviewField
                      label="Depreciation Frequency"
                      value={formatDepreciationFrequency(
                        initialData?.frequency,
                      )}
                    />
                    <PreviewField
                      label="Depreciation Method"
                      value={formatDepreciationMethod(
                        initialData?.depreciationMethod,
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BanknoteArrowDown className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {mode === 'edit' ? 'New Values' : 'Depreciation Details'}
                  </h3>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <PreviewField
                    label="Useful Life"
                    value={formatNumber.withCommas(formData.usefulLife)}
                    changed={formData.usefulLife !== initialData?.usefulLife}
                  />
                  <PreviewField
                    label="Useful Life Unit"
                    value={formatUsefulLifeUnit(formData.usefulLifeUnit)}
                    changed={
                      formData.usefulLifeUnit !== initialData?.usefulLifeUnit
                    }
                  />
                  <PreviewField
                    label="Salvage Value"
                    value={formatNumber.currency(formData.salvageValue, 'PHP')}
                    changed={
                      formData.salvageValue !== initialData?.salvageValue
                    }
                  />
                  <PreviewField
                    label="First Depreciation Date"
                    value={formatDate.shortDate(formData.firstDepreciationDate)}
                    changed={
                      formData.firstDepreciationDate !==
                      initialData?.firstDepreciationDate
                    }
                  />
                  <PreviewField
                    label="Depreciation Frequency"
                    value={formatDepreciationFrequency(formData.frequency)}
                    changed={formData.frequency !== initialData?.frequency}
                  />
                  <PreviewField
                    label="Depreciation Method"
                    value={formatDepreciationMethod(
                      formData.depreciationMethod,
                    )}
                    changed={
                      formData.depreciationMethod !==
                      initialData?.depreciationMethod
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

export default AssetDeprecitionFormModal;
