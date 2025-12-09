// src/components/chatbot/chat-input.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
  maxLength: number;
}

export default function ChatInput({
  onSendMessage,
  isSending,
  maxLength,
}: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const handleSend = () => {
    if (!inputMessage.trim() || isSending) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Allow Shift+Enter for new line (default behavior)
  };

  const remainingChars = maxLength - inputMessage.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              disabled={isSending}
              className="min-h-[52px] max-h-[200px] resize-none pr-16"
              rows={1}
            />
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                isOverLimit
                  ? 'text-destructive font-medium'
                  : remainingChars < 50
                  ? 'text-warning'
                  : 'text-muted-foreground'
              }`}
            >
              {remainingChars < 100 && `${remainingChars} left`}
            </div>
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isSending || isOverLimit}
            size="icon"
            className="h-[52px] w-[52px] flex-shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isSending && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            AI is thinking...
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> to
          send,{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded">Shift+Enter</kbd> for
          new line
        </p>
      </div>
    </div>
  );
}
