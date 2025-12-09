'use client';
import React, { useState } from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import useEmployeeFormLogic from './employee-form.logic';
import { FormModalProps } from '@/interfaces/shared.interface';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  CheckIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  Mail,
  Phone,
  Building,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployeeIdGenerator from './employee_id_generator';

const EmployeeFormModal: React.FC<FormModalProps> = ({
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
    emailError,
    setEmailError,
    handleChange,
    handleContactNumberChange,
    contactNoError,
    setContactNoError,
  } = useEmployeeFormLogic(open, close, mode, initialData, onSuccess);

  return (
    <>
      <Modal
        width="!max-w-[80vw]"
        open={open}
        close={() => openConfirm('close')}
        title={mode === 'edit' ? 'Edit Employee' : 'Create Employee'}
        footerChildren={
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => openConfirm('reset')}
            >
              Reset
            </Button>

            <Button type="submit" form="form" disabled={false}>
              {mode === 'edit' ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        }
      >
        <form id="form" onSubmit={handleSubmit} className="p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Employee Basic Information
          </h2>
          <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div className="flex flex-col space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Input Employee ID"
                  required
                />
              </div> */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <EmployeeIdGenerator
                  value={formData.employeeId}
                  onChange={(newId) =>
                    setFormData((prev) => ({ ...prev, employeeId: newId }))
                  }
                  mode={mode}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Input First Name"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="middleName">Middle Name (optional)</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Input middle Name"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Input last Name"
                  required
                />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Employee Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Input Email Address"
                    required
                    className="pl-10"
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleContactNumberChange}
                    placeholder="Input Phone Number"
                    required
                    className="pl-10"
                  />
                </div>
                {contactNoError && (
                  <p className="text-sm text-red-500 mt-1">{contactNoError}</p>
                )}
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Other Informations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  Department
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="department"
                    name="department"
                    type="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Input Department"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  Position
                </Label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="position"
                    name="position"
                    type="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Input Position"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
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
};

export default EmployeeFormModal;
