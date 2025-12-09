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
import {
  FormContainer,
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import {
  Book,
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
import useCourseFormLogic from './course-form.logic';

const CourseFormModal: React.FC<FormModalProps> = ({
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
    previewData,
    isFormValid,
    hasChanges,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
  } = useCourseFormLogic(open, close, mode, initialData, onSuccess);

  useEffect(() => {
    if (isConfirmed) {
      setIsConfirmed(false);
    }
  }, [formData]);

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
              <Book className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {mode === 'edit' ? 'Edit Course Record' : 'Create New Record'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit'
                  ? 'Update existing Course information'
                  : 'Add a new Course record'}
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
              title="Course Information"
              description="Core details"
              icon={<Package className="w-4 h-4" />}
            >
              <FormGrid columns={1}>
                <FormField
                  label="Course Name"
                  icon={<FileText className="w-4 h-4" />}
                  required
                  helper="Name of the Course"
                >
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="course name"
                    className="h-11"
                    required
                  />
                </FormField>
                <FormField
                  label="Course Description"
                  icon={<FileText className="w-4 h-4" />}
                  required
                  helper="Description"
                >
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="description"
                    className="h-11"
                    required
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
            : 'Review Before Creation'
        }
        description={
          mode === 'edit'
            ? 'Compare the previous and updated details before proceeding.'
            : 'Please review the details before creating.'
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
                    <PreviewField
                      label="Course Name"
                      value={initialData?.name}
                    />
                    <PreviewField
                      label="Course Description"
                      value={initialData?.description}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Book className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {mode === 'edit' ? 'New Values' : 'Details'}
                  </h3>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <PreviewField
                    label="Course Name"
                    value={formData.name}
                    changed={formData.name !== initialData?.name}
                  />
                  <PreviewField
                    label="Course Description"
                    value={formData.description}
                    changed={formData.description !== initialData?.description}
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

export default CourseFormModal;
