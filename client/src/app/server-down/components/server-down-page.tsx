'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ServerCrash,
  RefreshCw,
  AlertTriangle,
  Database,
  Home,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ServerDownPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [autoRetry, setAutoRetry] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');

  // Set timestamp only on client side to avoid hydration mismatch
  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  // Auto-retry countdown
  useEffect(() => {
    if (!autoRetry || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkServerAndRetry();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRetry, countdown]);

  const checkServerAndRetry = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_HEALTH_CHECK_URL ||
          'http://localhost:3005/api/health',
        { cache: 'no-store' },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok' && data.database === 'connected') {
          router.push('/');
          router.refresh();
          return;
        }
      }
    } catch (error) {
      console.error('Server check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetryNow = () => {
    setCountdown(30);
    checkServerAndRetry();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Error Card */}
        <Card className="border-red-200 dark:border-red-900 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <ServerCrash className="w-20 h-20 text-red-500 dark:text-red-400 animate-pulse" />
                <Database className="w-8 h-8 text-red-600 dark:text-red-500 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Server Connection Lost
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              We're unable to connect to the backend server
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            <Alert
              variant="destructive"
              className="border-red-300 dark:border-red-800"
            >
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">
                Connection Error
              </AlertTitle>
              <AlertDescription className="mt-2">
                The database server is currently unreachable or the backend
                service is down. This could be due to:
                <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                  <li>Server maintenance or restart</li>
                  <li>Database connection issues</li>
                  <li>Network connectivity problems</li>
                  <li>Backend service unavailability</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Auto-retry Status */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auto-retry enabled
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoRetry(!autoRetry)}
                  className="text-xs"
                >
                  {autoRetry ? 'Disable' : 'Enable'}
                </Button>
              </div>

              {autoRetry && (
                <div className="flex items-center gap-2">
                  <RefreshCw
                    className={`w-4 h-4 text-blue-500 ${
                      isChecking ? 'animate-spin' : ''
                    }`}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {isChecking
                      ? 'Checking server status...'
                      : `Next retry in ${countdown} seconds`}
                  </span>
                </div>
              )}

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRetryNow}
                disabled={isChecking}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                size="lg"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Retry Now
                  </>
                )}
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Home
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If this problem persists, please contact your system
                administrator or try again later.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Error Code: SERVER_UNREACHABLE
            {timestamp && ` | Timestamp: ${timestamp}`}
          </p>
        </div>
      </div>
    </div>
  );
}
