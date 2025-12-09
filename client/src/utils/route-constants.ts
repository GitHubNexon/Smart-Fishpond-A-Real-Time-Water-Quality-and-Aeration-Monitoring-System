// src/utils/route-constants.ts
export const publicRoutes = [
  '/',
  '/login',
  '/passkey',
  '/forbidden',
  //   "/register",
  //   "/register-verify",
  //   "/register-complete",
  //   "/reset-password",
  //   "/reset-password-verify",
  //   "/reset-password-complete",
  //   "/explore",
  //   "/creators",
  '/about',
  '/blogs',
];

export const privateRoutes = [
  '/admin',
  '/admin/users',
  '/admin/roles',
  '/admin/permissions',
  '/admin/audit-logs',
  '/notifications',
  '/dashboard',
  '/profile',
  '/account',
  '/search',
  '/system',
  '/chat-bot',

  '/employee-info',
  '/my-attendance',
  '/my-schedule',
  '/leave-requests',
  '/payslips',
  '/benefits',
  '/my-documents',
  '/my-performance',
  '/my-certificates',
  //hr-admin
  '/employee-records',
  '/attendance-management',
  '/schedule-management',
  '/leave-management',
  '/payroll-management',
  '/benefits-management',
  '/documents-management',
  '/performance-management',
  '/certificates-management',
  '/reports',
  '/deductions',
  '/allowances',
  '/payslips-management',
  '/reimbursements',
  '/cash-advances',
  '/government-reports',
  '/tax-documents',
  '/financial-statements',
];

const allRoutes = [
  { label: 'Dashboard', value: '/dashboard' },
  { label: 'Account Profile', value: '/profile' },
  { label: 'Account Information', value: '/account' },
  { label: 'Notifications', value: '/notifications' },
  { label: 'Announcements', value: '/announcements' },
];
const adminRoutes = [
  {
    label: 'Admin - Users',
    value: '/admin/users',
  },
  {
    label: 'Admin - Roles',
    value: '/admin/roles',
  },
  {
    label: 'Admin - Permissions',
    value: '/admin/permissions',
  },
  {
    label: 'Admin - System Audit Logs',
    value: '/admin/audit-logs',
  },
];

export const routesByCategory = {
  all: allRoutes,
  admin: adminRoutes,
  employee: [
    ...allRoutes,
    { label: 'My Attendance', value: '/my-attendance' }, // employee specific
    { label: 'My Schedule', value: '/my-schedule' }, // employee specific
    { label: 'Leave Requests', value: '/leave-requests' }, // employee specific
    { label: 'Payslips', value: '/payslips' }, // employee specific
    { label: 'Benefits', value: '/benefits' }, // employee specific
    { label: 'My Documents', value: '/my-documents' }, // employee specific
    { label: 'Performance Review', value: '/my-performance' }, // employee specific
    { label: 'Certificates', value: '/my-certificates' }, // employee specific
  ],
  hr: [
    ...allRoutes,
    ...adminRoutes,

    // HR Core
    { label: 'Employee Information', value: '/employee-info' },
    { label: 'Employee Records', value: '/employee-records' },
    { label: 'Attendance Management', value: '/attendance-management' },
    { label: 'Schedule Management', value: '/schedule-management' },
    { label: 'Leave Management', value: '/leave-management' },

    // Payroll & Benefits
    { label: 'Payroll Management', value: '/payroll-management' },
    { label: 'Benefits Management', value: '/benefits-management' },
    { label: 'Documents Management', value: '/documents-management' },

    // Performance
    { label: 'Performance Reviews', value: '/performance-management' },
    { label: 'Certificate Documents', value: '/certificates-management' },

    // HR Tools
    { label: 'Reports', value: '/reports' },
  ],
  accountant: [
    ...allRoutes,

    // Payroll Operations
    { label: 'Employee Information', value: '/employee-info' },
    { label: 'Deductions & Contributions', value: '/deductions' },
    { label: 'Allowance Management', value: '/allowances' },

    // Employee Finance
    { label: 'Employee Payslips', value: '/payslips-management' },
    { label: 'Reimbursements', value: '/reimbursements' },
    { label: 'Cash Advance Requests', value: '/cash-advances' },

    // Government & Compliance
    { label: 'Government Reports', value: '/government-reports' },
    { label: 'Tax Documents', value: '/tax-documents' },

    // Financial Reports
    { label: 'Financial Statements', value: '/financial-statements' },
  ],

  // Add more categories as needed
};

// Helper to get routes for a specific category
export const getRoutesByCategory = (
  category: keyof typeof routesByCategory,
) => {
  return routesByCategory[category] || [];
};

// Helper to get all route values (for default selection)
export const getAllRouteValues = () => {
  return Object.values(routesByCategory)
    .flat()
    .map((r) => r.value);
};

// Type for route items
export type RouteItem = {
  label: string;
  value: string;
};

// Type for category keys
export type RouteCategory = keyof typeof routesByCategory;
