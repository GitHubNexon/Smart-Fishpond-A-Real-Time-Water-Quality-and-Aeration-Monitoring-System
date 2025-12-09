'use client';

import { DataTable } from '@/components/customs/data-table/data-table.component';
import { usePermissionTableLogic } from './permissions-table.logic';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';

export default function PermissionsTable() {
  const CheckUser = useAuthCheck();
  const checkAdmin = () => {
    return CheckUser.user?.email === 'admin@email.com';
  };
  const {
    columns,
    fetchPermissions,
    handleSetRefreshFn,
    handleAddNewPermission,
    checkboxActions,
    renderPermissionFormModal,
    cardComponent,
  } = usePermissionTableLogic();

  return (
    <div className="container mx-auto py-8">
      <DataTable
        columns={columns}
        fetchData={fetchPermissions}
        enableServerSide
        enableSearch
        enableColumnVisibility
        enableRowSelection={false}
        enablePagination
        enableSorting
        enableRefreshButton
        searchPlaceholder="Search permission..."
        title="Permission List"
        description="All permissions for users. Management of these permissions is restricted to System Administrator only."
        // onAddNew={checkAdmin() ? handleAddNewPermission : undefined}
        // addButtonText={checkAdmin() ? 'Add Permissions' : undefined}
        refreshButtonText="Refresh"
        emptyStateMessage="No permission found."
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxActions={checkboxActions}
        initialLoadDelay={1000}
        fetchLoadDelay={500}
        className="max-w-full"
        onRefresh={handleSetRefreshFn}
        enableCard={true}
        cardComponent={cardComponent}
        enableUrlSync={true}
        storageKey="permissions"
      />

      {renderPermissionFormModal()}
    </div>
  );
}
