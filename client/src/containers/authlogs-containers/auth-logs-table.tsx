'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useAuthLogsTableLogic } from './auth-logs-table.logic';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';

export default function AuthLogsTable() {
  const { user } = useAuthCheck();
  const { columns, fetchAuthLogs, handleSetRefreshFn, cardComponent } =
    useAuthLogsTableLogic();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading Authentication Logs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 ">
      <DataTable
        key={user?.id}
        columns={columns}
        fetchData={fetchAuthLogs}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search logs..."
        title="Authentication Logs"
        description="Your Authentication logs: All logs older than 30 days will be deleted."
        refreshButtonText="Refresh"
        emptyStateMessage="No Auth Logs found. Please hit Refresh to fetch data."
        fetchLoadDelay={100}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialLoadDelay={1000}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        readOnly={true}
        enableUrlSync={true}
        storageKey="auth_logs"
      />
    </div>
  );
}
