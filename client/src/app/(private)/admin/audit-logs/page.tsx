// app/(private)/admin/audit-logs/page.tsx
import AuditLogsTable from '@/containers/audit-logs-containers/audit-logs-table';

export const metadata = {
  title: 'Audit Logs | Admin Panel',
};

export default function AuditLogsPage() {
  return <AuditLogsTable />;
}
