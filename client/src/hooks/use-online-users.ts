'use client';

import { useOnlineUsers as useProviderOnlineUsers } from '@/providers/socket-provider';

export function useOnlineUsers() {
  return useProviderOnlineUsers();
}
