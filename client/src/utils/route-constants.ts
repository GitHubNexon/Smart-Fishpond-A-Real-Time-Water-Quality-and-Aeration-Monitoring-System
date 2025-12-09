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
  '/admin/users',
  '/admin/roles',
  '/admin/permissions',
  '/admin/audit-logs',
  '/notifications',
  '/dashboard',
  '/profile',
  '/account',
  '/chat-bot',
  '/announcements',
  '/projects',
  '/documents',
  '/reports',
  '/site-inspections',
  '/assigned-tasks',
  '/safety-reports',
  '/equipment',
  '/purchase-orders',
  '/costs',
];

const allRoutes = [
  { label: 'Chat Bot', value: '/chat-bot' },
  { label: 'Dashboard', value: '/dashboard' },
  { label: 'Account Profile', value: '/profile' },
  { label: 'Account Information', value: '/account' },
  { label: 'Notifications', value: '/notifications' },
  { label: 'Announcements', value: '/announcements' },
  { label: 'Project Overview', value: '/projects' },
  { label: 'Documents', value: '/documents' },
  { label: 'Reports & Dashboards', value: '/reports' },
  { label: 'Site Inspections', value: '/site-inspections' }, //CRUD
  { label: 'Assigned Tasks', value: '/assigned-tasks' },
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
  safety_officer: [
    ...allRoutes,
    { label: 'Assigned Tasks', value: '/assigned-tasks' },
    { label: 'Safety Reports', value: '/safety-reports' },
    { label: 'Equipment & Materials', value: '/equipment' },
  ],
  client: [...allRoutes],
  procurement_manager: [
    ...allRoutes,
    { label: 'Equipment & Materials', value: '/equipment' },
    { label: 'Purchase Orders', value: '/purchase-orders' },
    { label: 'Cost Tracking', value: '/costs' },
  ],
  project_manager: [
    ...allRoutes,
    ...adminRoutes,
    { label: 'Safety Reports', value: '/safety-reports' },
    { label: 'Equipment & Materials', value: '/equipment' },
    { label: 'Purchase Orders', value: '/purchase-orders' },
    { label: 'Cost Tracking', value: '/costs' },
  ],
  site_engineer: [...allRoutes],
  architect: [...allRoutes],

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
