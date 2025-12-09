'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { extractErrorMessage } from '@/configs/api.helper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VerifyPasskey, AuthCheck } from '@/api/protected/auth.api';
import { getUserById } from '@/api/protected/user.api';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { OTPInput, SlotProps } from 'input-otp';
import { cn } from '@/lib/utils';
import type { UserData } from '@/interfaces/user-api.interface';
import type { AuthCheckResponse } from '@/interfaces/auth-api.interface';
import type { AuthPasskeyFormData } from './interfaces/shared-form.interface';
import { showToastSuccess, showToastError } from '@/utils/toast-config';

export default function PasskeyPageAuth() {
  const router = useRouter();
  const { user } = useAuthCheck();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState<AuthCheckResponse | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<AuthPasskeyFormData>({
    userId: null,
    passKey: '',
  });

  useEffect(() => {
    const handleAuthCheck = async () => {
      setLoading(true);
      try {
        const response = await AuthCheck();
        setAuthData(response);
      } catch (err) {
        console.error(extractErrorMessage(err));
        setError('Auth check failed. Redirecting to login...');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    handleAuthCheck();
  }, [router]);

  useEffect(() => {
    if (!authData?.id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await getUserById(authData.id);
        setUserData(response.data);
      } catch (err) {
        console.error(extractErrorMessage(err));
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [authData]);

  useEffect(() => {
    if (userData?.id) {
      setFormData((prev) => ({ ...prev, userId: userData.id }));
    }
  }, [userData]);

  const handlePassKeyChange = (val: string) => {
    setFormData((prev) => ({ ...prev, passKey: val }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.passKey) {
      setError('Please enter your 6-digit passkey.');
      return;
    }

    setLoading(true);
    try {
      const response = await VerifyPasskey(formData.userId, formData.passKey);
      showToastSuccess(
        'Authentication successfull',
        response.message,
        'top-right',
      );
      router.replace('/dashboard');
    } catch (err) {
      const message = extractErrorMessage(err);
      showToastError('Authentication Failed', message, 'top-right');
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !authData && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          2-Factor Authentication
        </CardTitle>
        <CardDescription className="text-center">
          Enter your 2FA passkey to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="passKey"
              className="text-sm font-medium text-foreground text-center"
            >
              2FA Passkey
            </label>

            <div className="flex items-center justify-center">
              <OTPInput
                id="passKey"
                value={formData.passKey}
                onChange={handlePassKeyChange}
                containerClassName="flex items-center gap-3 justify-center"
                maxLength={6}
                render={({ slots }: { slots: SlotProps[] }) => (
                  <div className="flex gap-3 w-full justify-center">
                    {slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'h-12 w-12 flex items-center justify-center text-xl font-semibold rounded-md border transition-all duration-200',
                          slot.isActive
                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                            : 'border-border bg-background text-foreground',
                        )}
                      >
                        {slot.char ?? ''}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              Please enter your 6-digit authentication code.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-slate-200 text-darkblue hover:bg-slate-300 
              dark:bg-slate-800 dark:text-cream dark:hover:bg-darkblue cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Continue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
