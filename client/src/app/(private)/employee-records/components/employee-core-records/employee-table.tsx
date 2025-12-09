'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useEmployeeTableLogic } from './employee-table.logic';

export default function EmployeeTable() {
  const {
    columns,
    fetchEmployee,
    handleSetRefreshFn,
    handleAddNewEmployee,
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

  const filterOptions = [
    {
      key: 'isVerified',
      label: 'Verified',
      multiple: false,
      options: [
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Not Verified' },
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
        fetchData={fetchEmployee}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        // enableRowSelection
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search employee..."
        title="Employee Management"
        description="Manage and monitor all Employees"
        onAddNew={handleAddNewEmployee}
        enableFilters={true} // Enable filters
        filterOptions={filterOptions} // Pass filter options
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
        storageKey="employee_records"
        enableViewToggle={true}
        defaultViewType="row"
      />

      {renderUserFormModal()}
      {renderEmployeeDetailsDrawer()}
      {renderAuditLogsViewer()}
    </div>
  );
}
