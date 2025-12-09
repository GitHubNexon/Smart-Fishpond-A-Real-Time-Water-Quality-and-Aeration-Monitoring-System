'use client';
export const dynamic = 'error';


import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <Lock size={64} className="text-red-500 mb-4" />
      <h1 className="text-3xl font-semibold mb-2">403 - Forbidden</h1>
      <p className="text-gray-500 mb-6">
        You don’t have permission to access this page.
      </p>
      <Button onClick={() => router.push('/')}>Go Home</Button>
    </div>
  );
}
