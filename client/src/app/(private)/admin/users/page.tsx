// app/(private)/admin/users/page.tsx
import UsersTable from '@/containers/users-containers/users-table';

export const metadata = {
  title: 'Users | Admin Panel',
};

export default function UsersPage() {
  return <UsersTable />;
}
