// app/(private)/admin/permissions/page.tsx
import PermissionsTable from '@/containers/rbac-containers/permissions-table';

export const metadata = {
  title: 'Permissions | Admin Panel',
};

export default function PermissionsPage() {
  return <PermissionsTable />;
}
