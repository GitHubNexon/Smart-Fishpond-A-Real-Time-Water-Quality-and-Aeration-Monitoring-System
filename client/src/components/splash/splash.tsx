// components/splash/splash.tsx
"use client";
import { useEffect, useState } from "react";

interface SplashProps {
  isLoading?: boolean; // optional — if passed, ignore timer
  duration?: number;
  onFinish?: () => void;
}

export default function Splash({ isLoading, duration = 2000, onFinish }: SplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isLoading !== undefined) {
      setVisible(isLoading); // controlled by parent
    } else {
      // auto-hide after duration
      const timeout = setTimeout(() => {
        setVisible(false);
        onFinish?.();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, duration, onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden">
      <div className="h-full w-full bg-blue-600 animate-pulse"></div>
    </div>
  );
}