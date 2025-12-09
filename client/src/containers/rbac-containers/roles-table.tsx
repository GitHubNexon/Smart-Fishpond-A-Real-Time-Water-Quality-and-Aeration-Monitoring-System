"use client";

import { DataTable } from "@/components/customs/data-table/data-table.component";
import { useRolesTableLogic } from "./roles-table.logic";

export default function RolesTable() {
  const {
    columns,
    fetchRoles,
    handleSetRefreshFn,
    handleAddNewRole,
    checkboxActions,
    renderRoleFormModal,
    cardComponent,
  } = useRolesTableLogic();
  
  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchRoles}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search roles..."
        title="Roles Management"
        description="Management of all roles is restricted to the System Administrator only."
        onAddNew={handleAddNewRole}
        addButtonText="Add Role"
        refreshButtonText="Refresh"
        emptyStateMessage="No roles found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="roles"
      />

      {renderRoleFormModal()}
    </div>
  );;
}
