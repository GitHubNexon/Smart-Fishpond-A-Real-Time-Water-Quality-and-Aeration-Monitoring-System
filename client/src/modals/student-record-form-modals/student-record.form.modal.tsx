// student-record-form.modal.tsx

'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import { FormModalProps } from '@/interfaces/shared.interface';
import { Button } from '@/components/ui/button';
import FormPreviewer from '@/components/customs/form-previewer';
import { FormContainer } from '@/components/customs/form-layout';
import { Book, RotateCcw, Eye } from 'lucide-react';
import useStudentRecordFormLogic from './student-record-form.logic';
import StudentFormTabs from './student-form-tabs';
import StudentFormPreviewerContent from './student-form-previewer';

const StudentRecordFormModal: React.FC<FormModalProps> = ({
  open,
  close,
  mode = 'add',
  onSuccess,
  initialData = null,
}) => {
  const logic = useStudentRecordFormLogic(
    open,
    close,
    mode,
    initialData,
    onSuccess,
  );

  const {
    confirmType,
    currentDialog,
    openConfirm,
    handleCancel,
    handleConfirm,
    handleSubmit,
    formData,
    previewData,
    isFormValid,
    hasChanges,
    setIsConfirmed,
    setShowPreview,
    showPreview,
    isConfirmed,
  } = logic;

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
              <Book className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {mode === 'edit' ? 'Edit Student Record' : 'Create New Record'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'edit'
                  ? 'Update existing Student information'
                  : 'Add a new Student record'}
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
        <form id="student-form" onSubmit={handleSubmit} className="p-6">
          <FormContainer>
            <StudentFormTabs {...logic} />
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
        <StudentFormPreviewerContent
          mode={mode}
          formData={formData}
          initialData={initialData}
        />
      </FormPreviewer>
    </>
  );
};

export default StudentRecordFormModal;
