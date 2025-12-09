// 'use client';

// import dynamic from 'next/dynamic';

// import React, { useState } from 'react';
// const SideBar = dynamic(
//   () => import('@/components/navigation/private_navs/side-bar'),
//   {
//     ssr: false,
//   },
// );
// const Header = dynamic(
//   () => import('@/components/navigation/private_navs/header'),
//   {
//     ssr: false,
//   },
// );

// export default function PrivateRouteLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

//   return (
//     <>
//       {/* <div className="flex h-[100vh]"> */}
//       <div className="flex min-h-screen scroll-smooth">
//         {/* Desktop Sidebar */}
//         <div className="hidden md:block sticky top-0 h-screen">
//           <SideBar />
//         </div>

//         {/* Mobile Sidebar */}
//         {mobileSidebarOpen && (
//           <>
//             <div
//               className="fixed inset-0 bg-black/50 z-30 md:hidden"
//               onClick={() => setMobileSidebarOpen(false)}
//             />
//             <div className="fixed inset-y-0 left-0 w-64 z-40 md:hidden transition-transform transform">
//               <SideBar />
//             </div>
//           </>
//         )}

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* <Header
//             onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
//           /> */}
//           <div className="sticky top-0 z-20 bg-background">
//             <Header
//               onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
//             />
//           </div>

//           <div className="flex-1 overflow-auto bg-indigo-300 dark:bg-indigo-500 p-3">
//             <div className="rounded-xl bg-gradient-to-br from-background to-muted/20">
//               {children}
//             </div>
//             <footer>
//               <span className="self-end text-end m-2 block text-[0.6em] text-gray-800 dark:text-gray-200">
//                 v0.1 10/09/2025
//               </span>
//             </footer>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React from 'react';
import PrivateLayout from './private-layout';

export const dynamic = 'force-dynamic'; 

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
