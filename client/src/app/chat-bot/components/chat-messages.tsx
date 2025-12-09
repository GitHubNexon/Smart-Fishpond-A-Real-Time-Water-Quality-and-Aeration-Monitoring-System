// src/components/chatbot/ChatMessages.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import {
  SessionResponse,
  MessageResponse,
} from '@/api/protected/chatbot-api/chat-bot.interface';
import { formatDate } from '@syntaxsentinel/date-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Loader2, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatMessagesProps {
  currentSession: SessionResponse;
  messages: MessageResponse[];
  typingContent: string;
  isTyping: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onDeleteSession: (sessionId: string) => void;
}

// Markdown parser function
function parseMarkdown(text: string): string {
  if (!text) return text;

  let html = text;

  // Headers
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-base font-semibold mt-3 mb-2">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>',
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(
    /`(.+?)`/g,
    '<code class="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>',
  );

  // Tables
  const tableRegex = /(\|.+\|\n)+/g;
  html = html.replace(tableRegex, (match) => {
    const rows = match.trim().split('\n');
    let tableHtml =
      '<div class="overflow-x-auto my-3"><table class="w-full border-collapse"><tbody>';

    rows.forEach((row, idx) => {
      const cells = row.split('|').filter((cell) => cell.trim());
      if (idx === 1 && cells[0].match(/^[-:\s]+$/)) return; // Skip separator row

      const tag = idx === 0 ? 'th' : 'td';
      const cellClass =
        idx === 0
          ? 'border border-border px-3 py-2 font-semibold bg-muted text-left'
          : 'border border-border px-3 py-2';

      tableHtml += '<tr>';
      cells.forEach((cell) => {
        tableHtml += `<${tag} class="${cellClass}">${cell.trim()}</${tag}>`;
      });
      tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 my-1">• $1</li>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 my-1">• $1</li>');
  html = html.replace(
    /(<li class="ml-4 my-1">•.+<\/li>\n?)+/g,
    '<ul class="my-2">$&</ul>',
  );

  // Ordered lists
  let counter = 0;
  html = html.replace(/^\d+\.\s(.+)$/gm, () => {
    counter++;
    return `<li class="ml-4 my-1">${counter}. $1</li>`;
  });
  html = html.replace(
    /(<li class="ml-4 my-1">\d+\..+<\/li>\n?)+/g,
    '<ol class="my-2">$&</ol>',
  );

  // Line breaks
  html = html.replace(/\n/g, '<br />');

  return html;
}

export default function ChatMessages({
  currentSession,
  messages,
  typingContent,
  isTyping,
  onToggleSidebar,
  isSidebarOpen,
  onDeleteSession,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingContent]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="border-b p-4 bg-background flex items-center gap-3">
        {/* Close sidebar button - only on mobile when sidebar is open */}
        {isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={onToggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-semibold truncate">
            {currentSession.title}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Created {formatDate.readableDateTime(currentSession.createdAt)}
          </p>
        </div>
        {/* Delete Session Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDeleteSession(currentSession.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete this session</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 max-w-4xl mx-auto w-full">
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <Bot className="h-12 w-12 md:h-16 md:w-16 mb-4 text-muted-foreground" />
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-muted-foreground max-w-md px-4">
                Ask me anything! I'm here to help answer your questions and have
                a natural conversation with you.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300',
                    message.role === 'user' && 'flex-row-reverse',
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {message.role === 'user' ? (
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      'flex flex-col gap-1 max-w-[85%] md:max-w-[75%]',
                      message.role === 'user' && 'items-end',
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2.5',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted',
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <div
                          className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(message.content),
                          }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground px-2">
                      {formatDate.timeOnly(message.createdAt)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing message */}
              {isTyping && typingContent && (
                <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
                    <div className="rounded-lg px-4 py-2.5 bg-muted">
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(typingContent),
                          }}
                        />
                        <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground px-2 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Typing...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
