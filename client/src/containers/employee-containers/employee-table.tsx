'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useEmployeeTableLogic } from './employee-table.logic';

export default function EmployeeTable() {
  const {
    columns,
    fetchEmployee,
    handleSetRefreshFn,
    handleAddNewEmplyoee,
    handleCopy,
    cardComponent,
    checkboxActions,
    renderUserFormModal,

    auditLogsDrawerOpen,
    setAuditLogsDrawerOpen,
    auditLogsData,
    isLoadingAuditLogs,
    renderAuditLogsViewer,

    drawerOpen,
    setDrawerOpen,
    setSelectedForDetails,
    renderEmployeeDetailsDrawer,
  } = useEmployeeTableLogic();

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchEmployee}
        enableServerSide
        enableSearch
        enableColumnVisibility
        // enableRowSelection={false}
        enableRowSelection
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search employee..."
        title="Employee Management"
        description="Manage and monitor all Employees"
        onAddNew={handleAddNewEmplyoee}
        addButtonText="Add Employee"
        refreshButtonText="Refresh"
        emptyStateMessage="No Employees found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="employees"
      />

      {renderUserFormModal()}
      {renderEmployeeDetailsDrawer()}
      {renderAuditLogsViewer()}
    </div>
  );
}
