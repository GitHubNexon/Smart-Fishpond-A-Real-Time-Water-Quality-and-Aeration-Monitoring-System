// issuance-form.tsx
'use client';
import React from 'react';
import Modal from '@/components/customs/modal/modal';
import AlertDialog from '@/components/customs/alert-dialog';
import FormPreviewer from '@/components/customs/form-previewer';
import { FormModalProps } from '@/interfaces/shared.interface';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import useIssuanceFormLogic from './issuance-form.logic';
import { DatePicker } from '@/components/customs/date-picker';
import CustodianPicker from '@/modals/components/custodian-picker';
import {
  Package,
  RotateCcw,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  X,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { IssuanceTransactionType } from './issuance-form.interface';
import { Checkbox } from '@/components/ui/checkbox';
import TransactionNoPopUp from '../components/transaction-no-pop-up';

const IssuanceFormModal: React.FC<FormModalProps> = ({
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
    formData,
    setFormData,
    availableInventory,
    loading,
    loadingInventory,
    loadingTransaction, // NEW: Added
    showTransactionTypeSelector,
    showTransactionNoInput, // NEW: Added
    transactionNoInput, // NEW: Added
    setTransactionNoInput, // NEW: Added
    handleTransactionNoSubmit, // NEW: Added
    handleTransactionTypeSelect,
    handleInventoryToggle,
    handleSelectAllInventory,
    handleDeselectAllInventory,
    selectedInventoryItems,
    isFormValid,
    setShowPreview,
    showPreview,
    isConfirmed,
    handleActionClick,
    handleConfirmSubmit,
    setSelectedCustodian,
    selectedCustodian,
    transactionNoPopup,
    setTransactionNoPopup,
    showTransactionNoPopup,
    setShowTransactionNoPopup,
    inventorySearchQuery,
    setInventorySearchQuery,
    filteredInventory,
  } = useIssuanceFormLogic(open, close, onSuccess);

  const transactionTypeOptions = [
    {
      type: IssuanceTransactionType.DIRECT_ISSUANCE,
      label: 'Direct Issuance',
      description: 'Issue items directly (auto-approved)',
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      color:
        'border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950',
    },
    {
      type: IssuanceTransactionType.REQUEST_ISSUANCE,
      label: 'Request Issuance',
      description: 'Request items for approval',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      color:
        'border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950',
    },
    {
      type: IssuanceTransactionType.APPROVE_ISSUANCE,
      label: 'Approve Issuance',
      description: 'Approve pending requests',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
      color:
        'border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950',
    },
    {
      type: IssuanceTransactionType.REJECT_ISSUANCE,
      label: 'Reject Issuance',
      description: 'Reject pending requests',
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      color:
        'border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950',
    },
    {
      type: IssuanceTransactionType.RETURN_TO_INVENTORY,
      label: 'Return to Inventory',
      description: 'Return issued items',
      icon: <Package className="w-6 h-6 text-purple-500" />,
      color:
        'border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950',
    },
    {
      type: IssuanceTransactionType.MAKE_AVAILABLE, // NEW
      label: 'Make Available',
      description: 'Mark items as available for inventory',
      icon: <RotateCcw className="w-6 h-6 text-yellow-500" />,
      color:
        'border-yellow-200 dark:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-950',
    },
  ];

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
              <h2 className="text-xl font-semibold">
                Asset Issuance Transaction
              </h2>
              <p className="text-sm text-muted-foreground">
                {showTransactionTypeSelector
                  ? 'Select transaction type to begin'
                  : `${
                      transactionTypeOptions.find(
                        (opt) => opt.type === formData.transactionType,
                      )?.label
                    }`}
              </p>
            </div>
          </div>
        }
        footerChildren={
          !showTransactionTypeSelector && (
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
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Transaction
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Preview ({formData.inventoryIds.length})
                  </>
                )}
              </Button>
            </div>
          )
        }
      >
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Transaction Type Selection */}
            {showTransactionTypeSelector && (
              <div className="grid gap-4 md:grid-cols-2">
                {transactionTypeOptions.map((option) => (
                  <Card
                    key={option.type}
                    className={`cursor-pointer transition-all ${option.color}`}
                    onClick={() => handleTransactionTypeSelect(option.type)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        {option.icon}
                        <div>
                          <CardTitle className="text-lg">
                            {option.label}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {/* ===== NEW: Transaction Number Input Card ===== */}
            {showTransactionNoInput && !loadingInventory && (
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-950">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Enter Transaction Number
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter the transaction number to auto-populate the form
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transactionNo">Transaction Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="transactionNo"
                          placeholder="ISS-202511-0001"
                          value={transactionNoInput}
                          onChange={(e) =>
                            setTransactionNoInput(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleTransactionNoSubmit();
                            }
                          }}
                          disabled={loadingTransaction}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleTransactionNoSubmit}
                          disabled={
                            !transactionNoInput.trim() || loadingTransaction
                          }
                        >
                          {loadingTransaction ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Load
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        💡 This will automatically populate the form with items
                        and custodian from the selected transaction.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ===== NEW: Loading Transaction State ===== */}
            {loadingTransaction && (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading transaction data...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading Inventory State */}
            {loadingInventory && (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Loading available inventory...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Content - After transaction type is selected */}
            {/* UPDATED: Added !showTransactionNoInput condition */}
            {!showTransactionTypeSelector &&
              !loadingInventory &&
              !showTransactionNoInput && (
                <>
                  {/* Transaction Details */}
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Transaction Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Transaction Date */}
                      <div className="space-y-2">
                        <DatePicker
                          label="Transaction Date"
                          value={formData.transactionDate}
                          onChange={(date) =>
                            setFormData({ ...formData, transactionDate: date })
                          }
                        />
                      </div>

                      {/* Approved At - for DIRECT_ISSUANCE and APPROVE_ISSUANCE */}
                      {(formData.transactionType ===
                        IssuanceTransactionType.DIRECT_ISSUANCE ||
                        formData.transactionType ===
                          IssuanceTransactionType.APPROVE_ISSUANCE) && (
                        <div className="space-y-2">
                          <DatePicker
                            label="Approved Date"
                            value={formData.approvedAt}
                            onChange={(date) =>
                              setFormData({ ...formData, approvedAt: date })
                            }
                          />
                        </div>
                      )}

                      {/* Rejected At - for REJECT_ISSUANCE */}
                      {formData.transactionType ===
                        IssuanceTransactionType.REJECT_ISSUANCE && (
                        <>
                          <div className="space-y-2">
                            <DatePicker
                              label="Rejected Date"
                              value={formData.rejectedAt}
                              onChange={(date) =>
                                setFormData({ ...formData, rejectedAt: date })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rejectionReason">
                              Rejection Reason
                            </Label>
                            <Textarea
                              id="rejectionReason"
                              placeholder="Enter reason for rejection"
                              value={formData.rejectionReason || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  rejectionReason: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {/* Reason */}
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Enter reason for transaction"
                          value={formData.reason || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, reason: e.target.value })
                          }
                        />
                      </div>

                      {/* Remarks */}
                      <div className="space-y-2">
                        <Label htmlFor="remarks">Remarks (Optional)</Label>
                        <Textarea
                          id="remarks"
                          placeholder="Additional notes or comments"
                          value={formData.remarks || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              remarks: e.target.value,
                            })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inventory Selection */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Select Inventory Items ({
                            formData.inventoryIds.length
                          }{' '}
                          selected)
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAllInventory}
                            disabled={availableInventory.length === 0}
                          >
                            Select All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDeselectAllInventory}
                            disabled={formData.inventoryIds.length === 0}
                          >
                            Deselect All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by inventory no, asset name, or location..."
                          value={inventorySearchQuery}
                          onChange={(e) =>
                            setInventorySearchQuery(e.target.value)
                          }
                          className="pl-10 pr-10"
                        />
                        {inventorySearchQuery && (
                          <button
                            onClick={() => setInventorySearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Results Info */}
                      {inventorySearchQuery && (
                        <div className="text-sm text-muted-foreground">
                          Found {filteredInventory.length} of{' '}
                          {availableInventory.length} items
                        </div>
                      )}

                      {/* Inventory List */}
                      {availableInventory.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No inventory items available for this transaction type
                        </div>
                      ) : filteredInventory.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No items match your search criteria
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {filteredInventory.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleInventoryToggle(item.id)}
                            >
                              <Checkbox
                                checked={formData.inventoryIds.includes(
                                  item.id,
                                )}
                                onCheckedChange={() =>
                                  handleInventoryToggle(item.id)
                                }
                              />
                              <div className="flex-1">
                                <p className="font-medium">
                                  {item.inventoryNo}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.asset?.assetName} - {item.status}
                                  {item.location && ` • ${item.location}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Custodian Selection - Only show if items are selected */}
                  {formData.inventoryIds.length > 0 && (
                    <Card className="border-2 border-indigo-200 dark:border-indigo-800">
                      <CardHeader className="bg-indigo-50 dark:bg-indigo-950">
                        <CardTitle className="text-lg">
                          Assign Custodian
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Select an employee to be responsible for the selected
                          items
                        </p>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <Label htmlFor="custodian">Employee</Label>
                          <CustodianPicker
                            value={formData.custodianId || null}
                            onSelect={(emp) => setSelectedCustodian(emp)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
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
        headerTitle="Review Transaction Before Submitting"
        description="Please review all transaction details before confirming."
        before={[]}
        after={[]}
        footerText="Confirm & Submit"
        disabled={!isFormValid}
      >
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {/* Transaction Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Transaction Information
              </h3>
              <PreviewField
                label="Transaction Type"
                value={
                  transactionTypeOptions.find(
                    (opt) => opt.type === formData.transactionType,
                  )?.label
                }
              />
              <PreviewField
                label="Transaction Date"
                value={formData.transactionDate}
              />
              {formData.approvedAt && (
                <PreviewField
                  label="Approved Date"
                  value={formData.approvedAt}
                />
              )}
              {formData.rejectedAt && (
                <PreviewField
                  label="Rejected Date"
                  value={formData.rejectedAt}
                />
              )}
              {formData.reason && (
                <PreviewField label="Reason" value={formData.reason} />
              )}
              {formData.remarks && (
                <PreviewField label="Remarks" value={formData.remarks} />
              )}
              {formData.rejectionReason && (
                <PreviewField
                  label="Rejection Reason"
                  value={formData.rejectionReason}
                />
              )}
            </div>

            {/* Custodian Info */}
            <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">Custodian</h3>
              {selectedCustodian ? (
                <>
                  <PreviewField
                    label="Name"
                    value={`${selectedCustodian.firstName} ${selectedCustodian.lastName}`}
                  />
                  <PreviewField
                    label="Employee Id"
                    value={selectedCustodian.employeeId}
                  />
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Not Selected
                </span>
              )}
            </div>

            {/* Selected Items */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Selected Inventory Items ({selectedInventoryItems.length})
                </h3>
              </div>

              <div className="space-y-2">
                {selectedInventoryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-muted/50 border border-border rounded-lg p-3"
                  >
                    <div className="font-medium text-sm mb-2">
                      {index + 1}. {item.inventoryNo}
                    </div>
                    <PreviewField label="Asset" value={item.asset?.assetName} />
                    <PreviewField label="Status" value={item.status} />
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

      <TransactionNoPopUp
        open={showTransactionNoPopup}
        transactionNo={transactionNoPopup || ''}
        onClose={() => setShowTransactionNoPopup(false)}
      />
    </>
  );
};

export default IssuanceFormModal;
