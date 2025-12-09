// components/SplashOverlay.tsx
"use client";
import { useState, useEffect } from "react";
import Splash from "@/components/splash/splash";

export default function SplashOverlay() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <Splash />;
}
