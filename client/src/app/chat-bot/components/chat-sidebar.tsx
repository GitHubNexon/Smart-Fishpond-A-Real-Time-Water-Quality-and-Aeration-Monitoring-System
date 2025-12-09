// src/components/chatbot/chat-sidebar.tsx
'use client';

import React from 'react';
import { SessionResponse } from '@/api/protected/chatbot-api/chat-bot.interface';
import { formatDate } from '@syntaxsentinel/date-utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Plus,
  Trash2,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  sessions: SessionResponse[];
  currentSession: SessionResponse | null;
  isLoading: boolean;
  onSelectSession: (session: SessionResponse) => void;
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function ChatSidebar({
  sessions,
  currentSession,
  isLoading,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="pt-16 p-4 border-b">
        <h2 className="font-semibold text-lg">Chat History</h2>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button onClick={onCreateSession} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          {sessions.length >= 5 ? 'Limit reached (5)' : 'New Chat'}
        </Button>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chat sessions yet</p>
              <p className="text-xs">Create a new chat to get started</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  'group flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors',
                  currentSession?.id === session.id &&
                    'bg-accent border-primary',
                )}
                onClick={() => onSelectSession(session)}
              >
                <div className="flex-1 min-w-20 mr-2">
                  <p className="font-medium text-sm w-50 wrap-break-word">
                    {session.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate.relativeTime(session.updatedAt)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
