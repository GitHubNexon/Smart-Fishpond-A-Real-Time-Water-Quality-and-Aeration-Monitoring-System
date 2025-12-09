'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useAssetDepreciationTableLogic } from './asset-depreciation.table.logic';

export default function AssetDepreciationTable() {
  const {
    handleSetRefreshFn,
    handleCopy,
    renderFormModal,
    columns,
    fetchDepreciation,
    handleAddNewDepreciation,
    cardComponent,
    checkboxActions,
    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    auditLogsDrawerOpen,
    setAuditLogsDrawerOpen,
    auditLogsData,
    isLoadingAuditLogs,
    renderAuditLogsViewer,
    // renderAssetDetailsDrawer,
  } = useAssetDepreciationTableLogic();

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchDepreciation}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search Depreciation..."
        title="Asset Depreciation Management"
        description="Manage and monitor all Asset Depreciation Records"
        onAddNew={handleAddNewDepreciation}
        addButtonText="Create Depreication Record"
        refreshButtonText="Refresh"
        emptyStateMessage="No Records's found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="depreciation_records"
      />

      {renderFormModal()}
      {/* {renderAssetDetailsDrawer()}  */}
      {renderAuditLogsViewer()}
    </div>
  );
}
