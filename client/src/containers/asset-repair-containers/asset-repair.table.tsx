'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useRepairTableLogic } from './asset-repair-table.logic';

export default function RepairTable() {
  const {
    columns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleAddRepairTransaction,
    cardComponent,
    checkboxActions,
    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    renderRepairFormModal,
  } = useRepairTableLogic();

  const filterOptions = [
    {
      key: 'transactionType',
      label: 'Transaction Type',
      multiple: true, // Multi-select with checkboxes
      options: [
        { value: 'request_repair', label: 'Request Repair' },
        { value: 'return_for_repair', label: 'Return For Repair' },
        { value: 'send_to_repair', label: 'Send To Repair' },
        { value: 'complete_repair', label: 'Complete Repair' },
        { value: 'fail_repair', label: 'Failed Repair' },
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
        title="Repair Management"
        description="Manage and monitor all Repair Records"
        onAddNew={handleAddRepairTransaction}
        addButtonText="Create Repair Transaction"
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
        storageKey="repair_transaction"
      />

      {renderRepairFormModal()}
      {/* {renderInventoryDetailsDrawer()} */}
    </div>
  );
}
