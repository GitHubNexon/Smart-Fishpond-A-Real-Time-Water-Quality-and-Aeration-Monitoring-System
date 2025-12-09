'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useUsersTableLogic } from './users-table.logic';

export default function UsersTable() {
  const {
    columns,
    fetchUsers,
    handleSetRefreshFn,
    handleAddNewUser,
    checkboxActions,
    renderUserFormModal,
    cardComponent,

    drawerOpen,
    setDrawerOpen,
    selectedUserForDetails,
    auditLogsDrawerOpen,
    setAuditLogsDrawerOpen,
    auditLogsData,
    isLoadingAuditLogs,
    renderAuditLogsViewer,
    renderUserDetailsDrawer,
  } = useUsersTableLogic();

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchUsers}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search users..."
        title="Users Management"
        description="Manage and monitor all system users"
        onAddNew={handleAddNewUser}
        addButtonText="Add User"
        refreshButtonText="Refresh"
        emptyStateMessage="No users found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="users"
      />

      {renderUserFormModal()}
      {renderUserDetailsDrawer()}
      {renderAuditLogsViewer()}
    </div>
  );
}
