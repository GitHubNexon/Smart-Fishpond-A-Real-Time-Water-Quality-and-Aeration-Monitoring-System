'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Bell, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllNotificationList } from '@/api/protected/notif.api';
import { formatDate } from '@syntaxsentinel/date-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface Notification {
  title: string;
  description: string;
  url: string | null;
  actions: string;
  status: string;
  timestamp: string;
  author: {
    fullname: string;
    profileImage?: string | null;
  };
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function NotificationsPanel({
  isOpen,
  onClose,
}: NotificationsPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await getAllNotificationList();

      if (response.data) {
        const allNotifications = response.data;
        const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newNotifications = allNotifications.slice(startIndex, endIndex);

        if (pageNum === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
        }

        setHasMore(endIndex < allNotifications.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Initial fetch when panel opens
  useEffect(() => {
    if (isOpen) {
      setIsInitialLoad(true);
      setPage(1);
      setNotifications([]);
      setHasMore(true);
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isLoading && hasMore && !isInitialLoad && notifications.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage);
          }
        },
        { threshold: 0.1 },
      );

      const currentTarget = observerTarget.current;
      if (currentTarget) {
        observer.observe(currentTarget);
      }

      return () => {
        if (currentTarget) {
          observer.unobserve(currentTarget);
        }
      };
    }
  }, [
    hasMore,
    isLoading,
    page,
    isInitialLoad,
    notifications.length,
    fetchNotifications,
  ]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-2 md:right-4 top-16 md:top-20 w-[calc(100vw-1rem)] sm:w-96 md:w-[420px] z-50 animate-in slide-in-from-top-2 duration-200"
    >
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea
            className="h-[300px] sm:h-[400px] md:h-[500px]"
            ref={scrollRef}
          >
            <div className="px-4 pb-4">
              {isInitialLoad ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 animate-pulse"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    No notifications yet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Real-time updates will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <div
                      key={`${notification.timestamp}-${index}`}
                      className="p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={notification.author.profileImage || undefined}
                          />
                          <AvatarFallback>
                            {(() => {
                              const { fullname } = notification.author;
                              if (!fullname) return '';
                              const nameParts = fullname.split(' ');
                              const initials = nameParts
                                .filter(Boolean)
                                .map((n, idx) =>
                                  idx === 0 || idx === nameParts.length - 1
                                    ? n[0].toUpperCase()
                                    : '',
                                )
                                .join('');
                              return initials;
                            })()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Notification content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {notification.title}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDate.relativeTime(notification.timestamp)}
                            </span>
                            {notification.status && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {notification.status}
                              </span>
                            )}
                          </div>

                          {notification.url && (
                            <div className="mt-2">
                              <button
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                onClick={() => router.push(notification.url!)}
                              >
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Intersection Observer Target */}
                  <div ref={observerTarget} className="h-4" />

                  {/* Loading indicator for next page */}
                  {/* {isLoading && !isInitialLoad && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  )} */}

                  {isLoading && !isInitialLoad && (
                    <div className="space-y-3 p-4">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 animate-pulse"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* End of list message */}
                  {!hasMore && notifications.length > 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        No more notifications
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
