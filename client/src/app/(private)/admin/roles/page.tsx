// app/(private)/admin/roles/page.tsx
import RolesTable from '@/containers/rbac-containers/roles-table';

export const metadata = {
  title: 'Roles | Admin Panel',
};

export default function RolesPage() {
  return <RolesTable />;
}
