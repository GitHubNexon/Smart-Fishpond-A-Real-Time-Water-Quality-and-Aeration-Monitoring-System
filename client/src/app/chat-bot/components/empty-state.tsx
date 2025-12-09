// src/components/chatbot/empty-state.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateSession: () => void;
}

export default function EmptyState({ onCreateSession }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center max-w-md">
        <MessageSquare className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg md:text-xl font-semibold mb-2">
          No chat selected
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select a chat from the sidebar or create a new one to get started
        </p>
        <Button onClick={onCreateSession} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create New Chat
        </Button>
      </div>
    </div>
  );
}
