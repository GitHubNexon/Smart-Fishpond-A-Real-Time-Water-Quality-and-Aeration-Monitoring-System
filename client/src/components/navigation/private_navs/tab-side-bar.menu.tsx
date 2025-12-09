import { MdDashboard } from 'react-icons/md';
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaClipboardList,
  FaCertificate,
  FaFileAlt,
  FaBullhorn,
  FaUsers,
  FaClipboardCheck,
  FaBookOpen,
  FaTasks,
  FaUser,
  FaFileInvoice,
  FaHardHat,
  FaTools,
  FaFolderOpen,
  FaChartBar,
  FaRegClipboard,
  FaShieldAlt,
  FaDollarSign,
} from 'react-icons/fa';
import { FaUserShield } from 'react-icons/fa6';

interface MenuItems {
  path: string;
  icon: React.ReactNode;
  label: string;
  role: string[];
}

// Icon mapping based on labels for construction management
const getIconForLabel = (label: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    Dashboard: <MdDashboard />,
    'Account Profile': <FaUser />,
    'Account Information': <FaUserShield />,
    Notifications: <FaBullhorn />,
    Announcements: <FaBullhorn />,
    'Project Overview': <FaFolderOpen />,
    'Reports & Dashboard': <FaChartBar />,
    'Project Documents': <FaFileAlt />,
    'Site Inspections': <FaRegClipboard />,
    'Work Equipments': <FaTools />,
    'Admin - Users': <FaUsers />,
    'Admin - Roles': <FaUserShield />,
    'Admin - Permissions': <FaClipboardCheck />,
    'Admin - System Audit Logs': <FaFileAlt />,
    'Safety Reports': <FaHardHat />,
    'Site Inpections': <FaRegClipboard />,
    'Purchase Orders': <FaFileInvoice />,
    'Cost Tracking': <FaDollarSign />,
    'My Task': <FaTasks />,
  };

  return iconMap[label] || <FaClipboardList />;
};

// Base menu items configuration
const menuConfig = {
  dashboard: { path: '/dashboard', label: 'Dashboard', role: [] },
  profile: { path: '/profile', label: 'Account Profile', role: [] },
  account: { path: '/account', label: 'Account Information', role: [] },
  notifications: { path: '/notifications', label: 'Notifications', role: [] },
  announcements: { path: '/announcements', label: 'Announcements', role: [] },
  projects: { path: '/projects', label: 'Project Overview', role: [] },
  reports: { path: '/reports', label: 'Reports & Dashboard', role: [] },
  documents: { path: '/documents', label: 'Project Documents', role: [] },
  siteInspections: {
    path: '/site-inspections',
    label: 'Site Inspections',
    role: [],
  },
  equipment: { path: '/equipment', label: 'Work Equipments', role: [] },
  adminUsers: {
    path: '/admin/users',
    label: 'Admin - Users',
    role: ['Administrator', 'Moderator', 'Project-Manager'],
  },
  adminRoles: {
    path: '/admin/roles',
    label: 'Admin - Roles',
    role: ['Administrator', 'Moderator', 'Project-Manager'],
  },
  adminPermissions: {
    path: '/admin/permissions',
    label: 'Admin - Permissions',
    role: ['Administrator', 'Moderator', 'Project-Manager'],
  },
  adminAuditLogs: {
    path: '/admin/audit-logs',
    label: 'Admin - System Audit Logs',
    role: ['Administrator', 'Moderator', 'Project-Manager'],
  },
  safetyReports: {
    path: '/safety-reports',
    label: 'Safety Reports',
    role: ['Project-Manager', 'Safety-Officer'],
  },
  purchaseOrders: {
    path: '/purchase-orders',
    label: 'Purchase Orders',
    role: ['Procurement-Manager', 'Project-Manager'],
  },
  costTracking: {
    path: '/costs',
    label: 'Cost Tracking',
    role: ['Procurement-Manager', 'Project-Manager'],
  },
  myTasks: { path: '/assigned-tasks', label: 'My Task', role: [] },
};

// Helper function to create menu items with icons
const createMenuItems = (keys: string[]): MenuItems[] => {
  return keys.map((key) => {
    const config = menuConfig[key as keyof typeof menuConfig];
    return {
      ...config,
      icon: getIconForLabel(config.label),
    };
  });
};

// Export menu items for each role
export const AdministrativeMenuItems: MenuItems[] = createMenuItems([
  'dashboard',
  'profile',
  'account',
  'notifications',
  'announcements',
  'projects',
  'reports',
  'documents',
  'siteInspections',
  'equipment',
  'adminUsers',
  'adminRoles',
  'adminPermissions',
  'adminAuditLogs',
  'safetyReports',
  'purchaseOrders',
  'costTracking',
]);

export const ClientMenuItems: MenuItems[] = createMenuItems([
  'dashboard',
  'announcements',
  'projects',
]);

export const ProcurementManagerItems: MenuItems[] = createMenuItems([
  'dashboard',
  'announcements',
  'projects',
  'reports',
  'documents',
  'siteInspections',
  'equipment',
  'purchaseOrders',
  'costTracking',
  'myTasks',
]);

export const ProjectManagerItems: MenuItems[] = createMenuItems([
  'dashboard',
  'announcements',
  'projects',
  'reports',
  'documents',
  'siteInspections',
  'equipment',
  'adminUsers',
  'adminRoles',
  'adminPermissions',
  'adminAuditLogs',
  'safetyReports',
  'purchaseOrders',
  'costTracking',
]);

export const SiteEngineerMenuItems: MenuItems[] = createMenuItems([
  'dashboard',
  'announcements',
  'projects',
  'reports',
  'documents',
  'siteInspections',
  'myTasks',
  'equipment',
]);

export const ArchitectMenuItems: MenuItems[] = createMenuItems([
  'dashboard',
  'announcements',
  'projects',
  'reports',
  'documents',
  'siteInspections',
  'myTasks',
  'equipment',
]);

export const SafetyOfficerMenuItems: MenuItems[] = createMenuItems([
  'dashboard',
  'announcements',
  'projects',
  'reports',
  'documents',
  'siteInspections',
  'myTasks',
  'safetyReports',
  'equipment',
]);
