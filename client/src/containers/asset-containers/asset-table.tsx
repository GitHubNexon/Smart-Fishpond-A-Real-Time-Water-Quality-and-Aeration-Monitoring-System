'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useAssetTableLogic } from './assets-table.logic';

export default function AssetTable() {
  const {
    columns,
    fetchAsset,
    handleSetRefreshFn,
    handleAddNewAsset,
    handleCopy,
    cardComponent,
    checkboxActions,
    renderAssetBaseFormModal,

    auditLogsDrawerOpen,
    setAuditLogsDrawerOpen,
    auditLogsData,
    isLoadingAuditLogs,
    renderAuditLogsViewer,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    renderAssetDetailsDrawer,
  } = useAssetTableLogic();

  const filterOptions = [
    {
      key: 'isVerified',
      label: 'Verified',
      multiple: false, // single select (true or false)
      options: [
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Not Verified' },
      ],
    },
    {
      key: 'isDraft',
      label: 'Draft Status',
      multiple: false,
      options: [
        { value: 'true', label: 'Draft' },
        { value: 'false', label: 'Not Draft' },
      ],
    },
    {
      key: 'isFinalize',
      label: 'Finalize Status',
      multiple: false,
      options: [
        { value: 'true', label: 'Finalized' },
        { value: 'false', label: 'Not Finalized' },
      ],
    },
    {
      key: 'isApproved',
      label: 'Approval Status',
      multiple: false,
      options: [
        { value: 'true', label: 'Approved' },
        { value: 'false', label: 'Not Approved' },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchAsset}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search Asset..."
        title="Asset Management"
        description="Manage and monitor all Asset Records"
        onAddNew={handleAddNewAsset}
        enableFilters={true} // Enable filters
        filterOptions={filterOptions} // Pass filter options
        addButtonText="Add Asset"
        refreshButtonText="Refresh"
        emptyStateMessage="No Asset's found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="asset_records"
        enableViewToggle={true} 
        defaultViewType="row"
      />

      {renderAssetBaseFormModal()}
      {renderAssetDetailsDrawer()}
      {renderAuditLogsViewer()}
    </div>
  );
}
