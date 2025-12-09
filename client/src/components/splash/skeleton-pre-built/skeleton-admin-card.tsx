// src/components/splash/skeleton-pre-built/skeleton-admin-card.tsx
"use client";

import React from "react";
import Skeleton from "../skeleton-component";

const SkeletonAdminCard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 rounded-t-xl">
          <Skeleton height="2rem" width="50%" className="mb-2" />
          <Skeleton height="1rem" width="30%" />
        </div>

        {/* Body Skeleton */}
        <div className="bg-white p-6 rounded-b-xl shadow-lg space-y-4">
          {/* Role Row */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <Skeleton width="20%" height="1rem" />
            <Skeleton width="30%" height="1.5rem" rounded="rounded-full" />
          </div>

          {/* ID Row */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <Skeleton width="25%" height="1rem" />
            <Skeleton width="40%" height="1.25rem" rounded="rounded" />
          </div>

          {/* Footer Timestamp */}
          <div className="pt-4 border-t border-gray-200">
            <Skeleton width="40%" height="0.875rem" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonAdminCard;
