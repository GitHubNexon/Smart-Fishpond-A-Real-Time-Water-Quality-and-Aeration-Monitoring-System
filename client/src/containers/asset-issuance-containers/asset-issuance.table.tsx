'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useIssuanceTableLogic } from './asset-issuance-table.logic';

export default function IssuanceTable() {
  const {
    columns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleAddIssuanceTransaction,
    cardComponent,
    drawerOpen,
    checkboxActions,
    setDrawerOpen,
    setSelectedForDetails,
    renderIssuanceFormModal,
  } = useIssuanceTableLogic();

  const filterOptions = [
    {
      key: 'transactionType',
      label: 'Transaction Type',
      multiple: true, // Multi-select with checkboxes
      options: [
        { value: 'direct_issuance', label: 'Direct Issuance' },
        { value: 'request_issuance', label: 'Request Issuance' },
        { value: 'request_transfer', label: 'Request Transfer' },
        { value: 'return_to_inventory', label: 'Return to Inventory' },
        { value: 'make_available', label: 'Make Available' },
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
        title="Issuance Management"
        description="Manage and monitor all Issuance Records"
        onAddNew={handleAddIssuanceTransaction}
        addButtonText="Create Issuance Transaction"
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
        storageKey="issuance_transaction"
      />

      {renderIssuanceFormModal()}
      {/* {renderInventoryDetailsDrawer()} */}
    </div>
  );
}
