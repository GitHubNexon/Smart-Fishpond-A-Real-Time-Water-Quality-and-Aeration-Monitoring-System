// use-auth-check.hooks.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCheck } from '@/api/protected/auth.api';
import { AuthCheckResponse } from '@/interfaces/auth-api.interface';

export const useAuthCheck = (redirectPath: string | null = null) => {
  const [user, setUser] = useState<AuthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const lsUser = localStorage.getItem('user');
        if (!lsUser) {
          console.log('No user in localStorage — will set after auth check');
        }
        setLoading(true);
        const response = await AuthCheck();
        setUser(response);
        const minimalUser = {
          id: response.id,
          username: response.username,
        };
        localStorage.setItem('user', JSON.stringify(minimalUser));
      } catch (err) {
        console.error('Authentication check failed:', err);
        setUser(null);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        if (redirectPath) {
          router.push(redirectPath);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectPath]);

  return { user, loading, error };
};
