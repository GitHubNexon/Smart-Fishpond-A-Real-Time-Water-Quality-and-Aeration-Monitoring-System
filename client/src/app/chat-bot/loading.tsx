// src/app/(private)/chat-bot/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatBotLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Sidebar skeleton */}
      <div className="w-80 border-r pr-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>

      {/* Chat area skeleton */}
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-16 w-full mb-4" />
        <div className="flex-1 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-20 flex-1" />
            </div>
          ))}
        </div>
        <Skeleton className="h-20 w-full mt-4" />
      </div>
    </div>
  );
}
