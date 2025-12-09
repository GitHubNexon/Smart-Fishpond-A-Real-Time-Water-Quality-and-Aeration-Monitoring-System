'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useAssetInventoryTableLogic } from './asset-inventory-table.logic';
import { InventoryStatus } from '@/api/protected/assets-api/asset-inventory-api';

export default function AssetInventoryTable() {
  const {
    columns,
    fetchAssetInventory,
    handleSetRefreshFn,
    handleAddNewAsset,
    handleCopy,
    cardComponent,
    checkboxActions,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    renderInventoryFormModal,
    renderInventoryDetailsDrawer,
  } = useAssetInventoryTableLogic();

  const inventoryStatusOptions = Object.values(InventoryStatus).map(
    (status) => ({
      value: status,
      label: status.replace(/-/g, ' '), // optional: nicer label for UI
    }),
  );

  const filterOptions = [
    {
      key: 'isDraft',
      label: 'Status',
      options: [
        { value: 'true', label: 'Draft' },
        { value: 'false', label: 'Verified' },
      ],
    },
    {
      key: 'status',
      label: 'Item Status',
      multiple: true, // Multi-select with checkboxes
      options: inventoryStatusOptions,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchAssetInventory}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search Inventory..."
        title="Inventory Management"
        description="Manage and monitor all Inventory Records"
        onAddNew={handleAddNewAsset}
        addButtonText="Add Inventory"
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
        storageKey="asset_inventory"
      />

      {renderInventoryFormModal()}
      {renderInventoryDetailsDrawer()}
    </div>
  );
}
