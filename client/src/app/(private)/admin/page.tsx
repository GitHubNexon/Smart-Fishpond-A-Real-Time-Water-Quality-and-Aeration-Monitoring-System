// // // app/(private)/admin/page.tsx
// // "use client";

// import React, { Suspense } from 'react';
// import AdminPageContent from '@/components/pages/admin-page-content';
// import { Skeleton } from '@/components/ui/skeleton';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Admin Panel | RVTM AMS',
//   description: 'Manage users, roles, and permissions',
// };

// export default function AdminPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="h-screen w-screen p-6 flex flex-col gap-6">
//           {/* Header skeleton */}
//           <Skeleton className="h-12 w-1/3 rounded" />

//           {/* Tabs skeleton */}
//           <div className="flex gap-4">
//             <Skeleton className="h-10 w-24 rounded" />
//             <Skeleton className="h-10 w-24 rounded" />
//           </div>

//           {/* Main content skeleton */}
//           <Skeleton className="flex-1 w-full rounded-md" />
//         </div>
//       }
//     >
//       <AdminPageContent />
//     </Suspense>
//   );
// }

// app/(private)/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/admin/users');
}

/** file structure 
 app/(private)/admin/
├── layout.tsx           # Shared admin layout
├── page.tsx             # Redirects to /admin/users
├── users/page.tsx
├── roles/page.tsx
├── permissions/page.tsx
├── employees/page.tsx
└── audit-logs/page.tsx
*/
