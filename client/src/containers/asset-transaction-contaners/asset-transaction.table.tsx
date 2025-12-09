'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useAssetTransactionTableLogic } from './asset-transaction-table.logic';

export default function AssetTransactionTable() {
  const {
    columns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleAddNewTransaction,
    cardComponent,
    drawerOpen,
    checkboxActions,
    setDrawerOpen,
    setSelectedForDetails,
  } = useAssetTransactionTableLogic();

  const filterOptions = [
    {
      key: 'transactionType',
      label: 'Transaction Type',
      multiple: true, // Multi-select with checkboxes
      options: [
        { value: 'direct_issuance', label: 'Direct Issuance' },
        { value: 'request_issuance', label: 'Request Issuance' },
        { value: 'request_transfer', label: 'Request Transfer' },
        { value: 'return_to_custodian', label: 'Return to Custodian' },
      ],
    },
  ];

  /** 
  const filterOptions = [
    // Single-select filter (dropdown)
    {
      key: 'isDraft',
      label: 'Status',
      multiple: false, // Single select
      options: [
        { value: 'true', label: 'Draft' },
        { value: 'false', label: 'Published' },
      ],
    },

    // Multi-select filter (checkboxes) - NEW!
    {
      key: 'transactionType',
      label: 'Transaction Type',
      multiple: true, // Multi-select with checkboxes
      options: [
        { value: 'direct_issuance', label: 'Direct Issuance' },
        { value: 'request_issuance', label: 'Request Issuance' },
        { value: 'request_transfer', label: 'Request Transfer' },
        { value: 'return_to_custodian', label: 'Return to Custodian' },
      ],
    },

    // Another single-select example
    {
      key: 'priority',
      label: 'Priority',
      multiple: false,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
  ];
  */

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
        searchPlaceholder="Search transaction..."
        title="Asset Transactions Management"
        description="Manage and monitor all Transaction Records"
        // onAddNew={handleAddNewTransaction}
        // addButtonText="Create Transaction"
        refreshButtonText="Refresh"
        emptyStateMessage="No Inventory's found."
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
        storageKey="asset_transaction"
      />

      {/* {renderInventoryFormModal()}
      {renderInventoryDetailsDrawer()} */}
    </div>
  );
}
