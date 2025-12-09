//src/components/splash/skeleton-components.tsx
"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: string;
  className?: string;
  count?: number; // render multiple skeletons
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  rounded = "rounded",
  className = "",
  count = 1,
}) => {
  const baseClasses = "bg-gray-300 animate-pulse";

  const skeletonStyle = {
    width,
    height,
    borderRadius: rounded === "rounded" ? undefined : undefined,
  };

  const skeletonClass = twMerge(baseClasses, rounded, className);

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={skeletonClass}
          style={skeletonStyle}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default Skeleton;
