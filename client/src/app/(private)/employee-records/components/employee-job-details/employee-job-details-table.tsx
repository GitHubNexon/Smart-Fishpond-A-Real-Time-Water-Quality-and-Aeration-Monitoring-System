'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { useEmployeeJobDetailsTableLogic } from './employee-job-details-table.logic';

export default function EmployeeJobDetailsTable() {
  const {
    columns,
    fetchData,
    handleSetRefreshFn,
    handleAddNewEmployeeJobDetails,
    handleCopy,
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
  } = useEmployeeJobDetailsTableLogic();

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
  ];

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchData}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        // enableRowSelection
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search employee..."
        title="Employee Job Details Management"
        description="Manage and monitor all Employees Job Details"
        onAddNew={handleAddNewEmployeeJobDetails}
        enableFilters={true} // Enable filters
        filterOptions={filterOptions} // Pass filter options
        addButtonText="Add Employee Job Details"
        refreshButtonText="Refresh"
        emptyStateMessage="No Records found."
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

      {/* {renderUserFormModal()} */}
      {/* {renderEmployeeDetailsDrawer()} */}
      {renderAuditLogsViewer()}
    </div>
  );
}
