// src/components/chatbot/ChatBotComponent.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  createSession,
  sendMessage,
  getUserSessions,
  getSession,
  deleteSession,
} from '@/api/protected/chatbot-api/chat-bot.api';
import {
  SessionPayload,
  ChatPayload,
  SessionResponse,
  MessageResponse,
} from '@/api/protected/chatbot-api/chat-bot.interface';
import { extractErrorMessage } from '@/configs/api.helper';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import ChatSidebar from './chat-sidebar';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import EmptyState from './empty-state';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MIN_MESSAGE_LENGTH = 1;
const MAX_MESSAGE_LENGTH = 500;

const Notice: React.FC<{ text: string }> = ({ text }) => (
  <div className=" text-yellow-600 text-[0.7rem] px-4 py-2 -500 mb-2 rounded">
    {text}
  </div>
);

export default function ChatBotComponent() {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionResponse | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingContent, setTypingContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSessions();
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentSession?.id) {
      loadSessionMessages(currentSession.id);
    }
  }, [currentSession?.id]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await getUserSessions();
      setSessions(data);
      if (data.length > 0 && !currentSession) {
        setCurrentSession(data[0]);
      }
    } catch (error) {
      showToastError('Error', extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const data = await getSession(sessionId);
      setMessages(data.messages || []);
    } catch (error) {
      showToastError('Error', extractErrorMessage(error));
    }
  };

  const handleCreateSession = async () => {
    if (sessions.length >= 5) {
      showToastError(
        'Limit Reached',
        'You can only create up to 5 chat sessions.',
      );
      return;
    }
    try {
      const payload: SessionPayload = { title: 'New Chat' };
      const newSession = await createSession(payload);
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      showToastSuccess('Success', 'New chat session created');
    } catch (error) {
      showToastError('Error', extractErrorMessage(error));
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        setCurrentSession(remaining[0] || null);
        setMessages([]);
      }
      showToastSuccess('Success', 'Chat session deleted');
    } catch (error) {
      showToastError('Error', extractErrorMessage(error));
    }
  };

  const typeMessage = (fullText: string, callback: () => void) => {
    let currentIndex = 0;
    const chunkSize = 3;
    const delay = 30;

    setIsTyping(true);
    setTypingContent('');

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        const chunk = fullText.slice(currentIndex, currentIndex + chunkSize);
        setTypingContent((prev) => prev + chunk);
        currentIndex += chunkSize;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        setIsTyping(false);
        callback();
      }
    }, delay);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || !currentSession || isSending) return;

    if (messageContent.length < MIN_MESSAGE_LENGTH) {
      showToastError(
        'Message too short',
        `Please enter at least ${MIN_MESSAGE_LENGTH} character(s)`,
      );
      return;
    }

    if (messageContent.length > MAX_MESSAGE_LENGTH) {
      showToastError(
        'Message too long',
        `Please keep your message under ${MAX_MESSAGE_LENGTH} characters`,
      );
      return;
    }

    const userMessageContent = messageContent.trim();
    setIsSending(true);
    setTypingContent('');

    const tempUserMessage: MessageResponse = {
      id: `temp-user-${Date.now()}`,
      sessionId: currentSession.id,
      role: 'user',
      content: userMessageContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const payload: ChatPayload = {
        sessionId: currentSession.id,
        message: userMessageContent,
      };

      const response = await sendMessage(payload);

      typeMessage(response.content, () => {
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => !m.id.startsWith('temp-'));
          return [...withoutTemp, response];
        });
        setTypingContent('');
        setIsSending(false);
        loadSessionMessages(currentSession.id);
      });
    } catch (error) {
      showToastError('Error', extractErrorMessage(error));
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('temp-')));
      setTypingContent('');
      setIsTyping(false);
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-background rounded-xl overflow-auto relative">
      {/* Mobile Overlay - only covers chatbot area */}
      {/* {isSidebarOpen && (
        <div
          className="md:hidden fixed  inset-0 bg-black/50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )} */}

      {/* Sidebar - Slides in on mobile, always visible on desktop */}
      {/* <div
        className={`
          absolute md:relative inset-y-0 left-0 z-10
          w-80 border-r flex-shrink-0 bg-background
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <ChatSidebar
          sessions={sessions}
          currentSession={currentSession}
          isLoading={isLoading}
          onSelectSession={(session) => {
            setCurrentSession(session);
            setIsSidebarOpen(false); // Close on mobile after selection
          }}
          onCreateSession={handleCreateSession}
          onDeleteSession={handleDeleteSession}
        />
      </div> */}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-12 md:pt-0 ">
        {/* Mobile menu button */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute top-4 left-4 z-10"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button> */}

        {currentSession ? (
          <>
            <div className="flex-1 overflow-auto min-h-[200px]">
              <ChatMessages
                currentSession={currentSession}
                messages={messages}
                typingContent={typingContent}
                isTyping={isTyping}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onDeleteSession={handleDeleteSession}
              />
            </div>
            <div className="flex-shrink-0">
              <ChatInput
                onSendMessage={handleSendMessage}
                isSending={isSending}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <Notice text="This AI assistant may occasionally provide inaccurate information. For critical, auditable, or official decisions, always verify using authoritative sources such as reports, dashboards, system logs, etc. For more precise answers, include relevant identifiers, such as asset IDs, employee codes, department codes, transaction numbers, etc." />
            </div>
          </>
        ) : (
          <EmptyState onCreateSession={handleCreateSession} />
        )}
      </div>
    </div>
  );
}
