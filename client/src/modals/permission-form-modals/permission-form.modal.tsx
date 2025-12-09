'use client';

import React, { useState } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import usePermissionFormModalLogic from './permission-form.logic';
import { FormModalProps } from '@/interfaces/shared.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const PermissionFormModal: React.FC<FormModalProps> = ({
    open,
    close,
    mode = "add",
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
    } = usePermissionFormModalLogic(open, close, mode, initialData, onSuccess);

    return (
      <>
        <Modal
          open={open}
          close={() => openConfirm('close')}
          title={mode === 'edit' ? 'Edit Permission' : 'Create Permission'}
          footerChildren={
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => openConfirm('reset')}
              >
                Reset
              </Button>

              <Button type="submit" form="form">
                {mode === 'edit' ? 'Update Permission' : 'Create Permission'}
              </Button>
            </div>
          }
        >
          <form id="form" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="permission">Permission Name</Label>
                <Input
                  id="permission"
                  name="permission"
                  value={formData.permission}
                  onChange={handleChange}
                  placeholder="Permission name"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Input Description"
                />
              </div>
            </div>
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
      </>
    );
}

export default PermissionFormModal;