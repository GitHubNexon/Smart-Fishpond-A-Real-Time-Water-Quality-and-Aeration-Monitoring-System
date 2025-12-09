// src/components/splash/sidebar-skeleton.tsx
'use client';

import React from 'react';
import Skeleton from '@/components/splash/skeleton-component';

export default function SidebarSkeleton({
  isOpen = false,
}: {
  isOpen?: boolean;
}) {
  return (
    <div
      className={`flex ${
        isOpen ? 'w-64' : 'w-20'
      } h-full transition-all duration-300`}
    >
      <div className="bg-white dark:bg-accent p-5 space-y-6 shadow-lg flex flex-col w-full relative">
        {/* Toggle button skeleton */}
        <div className="mb-6 flex justify-center">
          <Skeleton width="24px" height="24px" rounded="rounded" />
        </div>

        {/* Menu items skeleton */}
        <div className="space-y-4 mt-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex items-center ${
                isOpen ? 'space-x-3 pl-5' : 'justify-center'
              }`}
            >
              <Skeleton width="24px" height="24px" rounded="rounded" />
              {isOpen && (
                <Skeleton width="100px" height="20px" rounded="rounded" />
              )}
            </div>
          ))}
        </div>

        {/* Logout skeleton */}
        <div
          className={`mt-auto flex items-center ${
            isOpen ? 'space-x-3 pl-5' : 'justify-center'
          }`}
        >
          <Skeleton width="24px" height="24px" rounded="rounded" />
          {isOpen && <Skeleton width="70px" height="20px" rounded="rounded" />}
        </div>
      </div>
    </div>
  );
}
