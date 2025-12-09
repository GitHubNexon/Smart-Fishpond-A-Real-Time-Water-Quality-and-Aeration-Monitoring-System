// AssetTransactionKanban.tsx - Updated Usage Example
'use client';

import { Kanban } from '@/components/customs/kanban/kanban.component';
import { useAssetTransactionKanbanLogic } from './useAssetTransactionKanbanLogic';

export default function AssetTransactionKanban() {
  const {
    transactionColumns,
    fetchAssetTransaction,
    handleSetRefreshFn,
    handleStatusChange,
    cardComponent,
    checkboxActions,
    filterOptions,
    drawerOpen,
    setDrawerOpen,
    selectedForDetails,
    setSelectedForDetails,
  } = useAssetTransactionKanbanLogic();

  return (
    <div className="container mx-auto py-8">
      <Kanban
        columns={transactionColumns}
        statusField="toStatus"
        fetchData={fetchAssetTransaction}
        onStatusChange={handleStatusChange}
        enableServerSide
        enableSearch
        enableFilters
        enableRowSelection={false}
        enableDragDrop={false}
        enableRefreshButton
        searchPlaceholder="Search transactions..."
        title="Asset Transaction Pipeline"
        description="Manage and monitor transactions through their lifecycle"
        emptyStateMessage="No transactions found."
        filterOptions={filterOptions}
        checkboxActions={checkboxActions}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="asset_transaction_kanban"
        idField="id"
        refreshButtonText="Refresh"
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        pageSize={50} // NEW: Set page size to 50 for infinite scroll
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
      />

      {/* You can add your drawer/modal here for viewing details */}
      {/* {renderInventoryDetailsDrawer()} */}
    </div>
  );
}
