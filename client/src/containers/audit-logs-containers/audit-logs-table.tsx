'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useAuditTableLogic } from './audit-logs-table.logic';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';

export default function AuditLogsTable() {
  const {
    columns,
    fetchAuditLogs,
    handleSetRefreshFn,
    cardComponent,
    refreshFn,
    setRefreshFn,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    renderAuditDetailsDrawer,
  } = useAuditTableLogic();
  return (
    <div className="container mx-auto py-8 ">
      <DataTable
        columns={columns}
        fetchData={fetchAuditLogs}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search logs..."
        title="Audit Logs"
        description="Audit Logs Table"
        refreshButtonText="Refresh"
        emptyStateMessage="No Audit Logs found. Please hit Refresh to fetch data."
        fetchLoadDelay={100}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialLoadDelay={1000}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        readOnly={true}
        enableUrlSync={true}
        storageKey="audits_logs"
      />

      {renderAuditDetailsDrawer()}
    </div>
  );
}
