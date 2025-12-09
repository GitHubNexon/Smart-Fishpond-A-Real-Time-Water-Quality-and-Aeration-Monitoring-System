'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useTransferTableLogic } from './asset-transfer-table.logic';

export default function TransferTable() {
  const {
    columns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleAddTransferTransaction,
    cardComponent,
    checkboxActions,
    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    renderTransferFormModal,
  } = useTransferTableLogic();

  const filterOptions = [
    {
      key: 'transactionType',
      label: 'Transaction Type',
      multiple: true, // Multi-select with checkboxes
      options: [
        { value: 'request_transfer', label: 'Request Transfer' },
        { value: 'approve_transfer', label: 'Approve Transfer' },
        { value: 'reject_transfer', label: 'Rejected Transfer' },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchAssetTransaction}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search record..."
        title="Transfer Management"
        description="Manage and monitor all Tranfer Records"
        onAddNew={handleAddTransferTransaction}
        addButtonText="Create Transfer Transaction"
        refreshButtonText="Refresh"
        emptyStateMessage="No Records's found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        enableFilters={true} // Enable filters
        filterOptions={filterOptions} // Pass filter options
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="transfer_transaction"
      />

      {renderTransferFormModal()}
      {/* {renderInventoryDetailsDrawer()} */}
    </div>
  );
}
