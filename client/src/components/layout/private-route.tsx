//src/components/layout/private-route.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCheck } from "@/api/protected/auth.api";
import { getAuthStatus, setAuthStatus } from "@/lib/auth-client";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const currentStatus = getAuthStatus();
    setStatus(currentStatus);

    if (currentStatus === "loading") {
      let mounted = true;
      const checkAuth = async () => {
        try {
          await AuthCheck();
          if (!mounted) return;
          setAuthStatus("authenticated");
          setStatus("authenticated");
        } catch {
          if (!mounted) return;
          setAuthStatus("unauthenticated");
          setStatus("unauthenticated");
          router.replace("/login"); // or "/"
        }
      };
      checkAuth();

      return () => {
        mounted = false;
      };
    } else if (currentStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [router]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      </div>
    );
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null; 
}
