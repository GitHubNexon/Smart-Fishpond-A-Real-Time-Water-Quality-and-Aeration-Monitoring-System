// src/app/(private)/chat-bot/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import ChatBotComponent from './components/chat-bot-component';

export const metadata: Metadata = {
  title: 'Chat Bot | RVTM AMS',
  description:
    'Interact with the AI chatbot and access real-time analytics, system stats, and overview.',
};

export default function ChatBotPage() {
  return (
    <div className="h-screen  flex">
      <ChatBotComponent />
    </div>
  );
}
