import { MdDashboard, MdSchool } from 'react-icons/md';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClipboardList,
  FaCertificate,
  FaFileAlt,
  FaBullhorn,
  FaUsers,
  FaClipboardCheck,
  FaGraduationCap,
  FaBookOpen,
  FaTasks,
  FaUser,
} from 'react-icons/fa';
import { FaUserShield } from 'react-icons/fa6';

interface MenuItems {
  path: string;
  icon: React.ReactNode;
  label: string;
  role: string[];
}

export const AdministrativeMenuItems: MenuItems[] = [
  { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard', role: [] },
  { path: '/profile', icon: <FaUser />, label: 'Account Profile', role: [] },
  {
    path: '/account',
    icon: <FaUserShield />,
    label: 'Account Information',
    role: [],
  },
  {
    path: '/notifications',
    icon: <FaBullhorn />,
    label: 'Notifications',
    role: [],
  },
  {
    path: '/announcements',
    icon: <FaBullhorn />,
    label: 'Announcements',
    role: [],
  },

  // Admin Routes
  {
    path: '/admin/users',
    icon: <FaUsers />,
    label: 'Admin - Users',
    role: ['Administrator', 'Moderator'],
  },
  {
    path: '/admin/roles',
    icon: <FaUserShield />,
    label: 'Admin - Roles',
    role: ['Administrator', 'Moderator'],
  },
  {
    path: '/admin/permissions',
    icon: <FaClipboardCheck />,
    label: 'Admin - Permissions',
    role: ['Administrator', 'Moderator'],
  },
  {
    path: '/admin/audit-logs',
    icon: <FaFileAlt />,
    label: 'Admin - System Audit Logs',
    role: ['Administrator', 'Moderator'],
  },
];

// Admin / HR menu
export const HRMenuItems: MenuItems[] = [
  { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard', role: [] },
  { path: '/profile', icon: <FaUser />, label: 'Account Profile', role: [] },
  {
    path: '/account',
    icon: <FaUserShield />,
    label: 'Account Information',
    role: [],
  },
  {
    path: '/notifications',
    icon: <FaBullhorn />,
    label: 'Notifications',
    role: [],
  },
  {
    path: '/announcements',
    icon: <FaBullhorn />,
    label: 'Announcements',
    role: [],
  },

  // Admin Routes
  {
    path: '/admin/users',
    icon: <FaUsers />,
    label: 'Admin - Users',
    role: ['HR-Administrator', 'Administrator'],
  },
  {
    path: '/admin/roles',
    icon: <FaUserShield />,
    label: 'Admin - Roles',
    role: ['HR-Administrator', 'Administrator'],
  },
  {
    path: '/admin/permissions',
    icon: <FaClipboardCheck />,
    label: 'Admin - Permissions',
    role: ['HR-Administrator', 'Administrator'],
  },
  {
    path: '/admin/audit-logs',
    icon: <FaFileAlt />,
    label: 'Admin - System Audit Logs',
    role: ['HR-Administrator', 'Administrator'],
  },

  // HR Core
  {
    path: '/employee-records',
    icon: <FaUser />,
    label: 'Employee Records',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
  {
    path: '/attendance-management',
    icon: <FaClipboardCheck />,
    label: 'Attendance Management',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
  {
    path: '/schedule-management',
    icon: <FaCalendarAlt />,
    label: 'Schedule Management',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
  {
    path: '/leave-management',
    icon: <FaClipboardList />,
    label: 'Leave Management',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },

  // Payroll & Benefits
  {
    path: '/payroll-management',
    icon: <FaFileAlt />,
    label: 'Payroll Management',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
  {
    path: '/benefits-management',
    icon: <FaBookOpen />,
    label: 'Benefits Management',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
  {
    path: '/documents-management',
    icon: <FaFileAlt />,
    label: 'Documents Management',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },

  // Performance
  {
    path: '/performance-management',
    icon: <FaTasks />,
    label: 'Performance Reviews',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
  {
    path: '/certificates-management',
    icon: <FaCertificate />,
    label: 'Certificate Documents',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },

  // Reports
  {
    path: '/reports',
    icon: <FaFileAlt />,
    label: 'Reports',
    role: ['HR-Administrator', 'HR-Manager', 'HR-Staff'],
  },
];

// Employee Menu
export const EmployeeMenuItems: MenuItems[] = [
  { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard', role: [] },
  { path: '/profile', icon: <FaUser />, label: 'Account Profile', role: [] },
  {
    path: '/account',
    icon: <FaUserShield />,
    label: 'Account Information',
    role: [],
  },
  {
    path: '/notifications',
    icon: <FaBullhorn />,
    label: 'Notifications',
    role: [],
  },
  {
    path: '/announcements',
    icon: <FaBullhorn />,
    label: 'Announcements',
    role: [],
  },

  // Employee Specific
  {
    path: '/my-attendance',
    icon: <FaClipboardCheck />,
    label: 'My Attendance',
    role: ['Employee'],
  },
  {
    path: '/my-schedule',
    icon: <FaCalendarAlt />,
    label: 'My Schedule',
    role: ['Employee'],
  },
  {
    path: '/leave-requests',
    icon: <FaClipboardList />,
    label: 'Leave Requests',
    role: ['Employee'],
  },
  {
    path: '/payslips',
    icon: <FaFileAlt />,
    label: 'Payslips',
    role: ['Employee'],
  },
  {
    path: '/benefits',
    icon: <FaBookOpen />,
    label: 'Benefits',
    role: ['Employee'],
  },
  {
    path: '/my-documents',
    icon: <FaFileAlt />,
    label: 'My Documents',
    role: ['Employee'],
  },
  {
    path: '/my-performance',
    icon: <FaTasks />,
    label: 'Performance Review',
    role: ['Employee'],
  },
  {
    path: '/my-certificates',
    icon: <FaCertificate />,
    label: 'Certificates',
    role: ['Employee'],
  },
];

// Accountant Menu
export const AccountantMenuItems: MenuItems[] = [
  { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard', role: [] },
  { path: '/profile', icon: <FaUser />, label: 'Account Profile', role: [] },
  {
    path: '/account',
    icon: <FaUserShield />,
    label: 'Account Information',
    role: [],
  },
  {
    path: '/notifications',
    icon: <FaBullhorn />,
    label: 'Notifications',
    role: [],
  },
  {
    path: '/announcements',
    icon: <FaBullhorn />,
    label: 'Announcements',
    role: [],
  },

  // Payroll Operations
  {
    path: '/deductions',
    icon: <FaClipboardList />,
    label: 'Deductions & Contributions',
    role: ['Accountant'],
  },
  {
    path: '/allowances',
    icon: <FaFileAlt />,
    label: 'Allowance Management',
    role: ['Accountant'],
  },

  // Employee Finance
  {
    path: '/payslips-management',
    icon: <FaFileAlt />,
    label: 'Employee Payslips',
    role: ['Accountant'],
  },
  {
    path: '/reimbursements',
    icon: <FaFileAlt />,
    label: 'Reimbursements',
    role: ['Accountant'],
  },
  {
    path: '/cash-advances',
    icon: <FaFileAlt />,
    label: 'Cash Advance Requests',
    role: ['Accountant'],
  },

  // Government & Compliance
  {
    path: '/government-reports',
    icon: <FaFileAlt />,
    label: 'Government Reports',
    role: ['Accountant'],
  },
  {
    path: '/tax-documents',
    icon: <FaFileAlt />,
    label: 'Tax Documents',
    role: ['Accountant'],
  },

  // Financial Reports
  {
    path: '/financial-statements',
    icon: <FaFileAlt />,
    label: 'Financial Statements',
    role: ['Accountant'],
  },
];
