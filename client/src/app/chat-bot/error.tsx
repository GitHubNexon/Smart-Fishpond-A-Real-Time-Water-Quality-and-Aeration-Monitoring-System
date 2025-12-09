// src/app/(private)/chat-bot/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function ChatBotError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ChatBot error:', error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message ||
            'An unexpected error occurred while loading the chatbot.'}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
