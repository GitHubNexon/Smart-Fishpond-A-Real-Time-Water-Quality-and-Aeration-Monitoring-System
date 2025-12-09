'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { getAllNotificationList } from '@/api/protected/notif.api';
import { formatDate } from '@syntaxsentinel/date-utils';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/providers/socket-provider';
import moment from 'moment';

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

const ITEMS_PER_PAGE = 10;

export default function NotificationComponent() {
  const router = useRouter();
  const { notifications: socketNotifications, setNotificationCount } =
    useNotifications();

  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch all notifications from API
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllNotificationList();
      if (response.data) {
        setAllNotifications(response.data);
        setFilteredNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Merge socket notifications with existing notifications
  useEffect(() => {
    if (socketNotifications.length > 0) {
      // Convert socket notifications to match the Notification interface
      const convertedSocketNotifs = socketNotifications.map((notif) => ({
        title: notif.title,
        description: notif.description || '',
        url: notif.url || notif.data?.url || null,
        actions: notif.actions || notif.data?.actions || '',
        status: notif.status || notif.data?.status || '',
        timestamp: notif.timestamp
          ? new Date(notif.timestamp).toISOString()
          : new Date().toISOString(),
        author: {
          fullname:
            notif.data?.author?.fullname || notif.data?.fullname || 'System',
          profileImage:
            notif.data?.author?.profileImage ||
            notif.data?.profileImage ||
            null,
        },
      }));

      // Merge socket notifications with API notifications
      setAllNotifications((prev) => {
        // Remove duplicates based on timestamp and title
        const merged = [...convertedSocketNotifs, ...prev];
        const unique = merged.filter(
          (notif, index, self) =>
            index ===
            self.findIndex(
              (n) => n.timestamp === notif.timestamp && n.title === notif.title,
            ),
        );
        return unique;
      });
    }
  }, [socketNotifications]);

  // Filter notifications based on time period
  const filterNotifications = useCallback(
    (filter: string) => {
      const now = moment();
      let filtered = allNotifications;

      switch (filter) {
        case 'yesterday':
          filtered = allNotifications.filter((notif) => {
            const notifDate = moment(notif.timestamp);
            return notifDate.isSame(now.clone().subtract(1, 'day'), 'day');
          });
          break;
        case 'last-week':
          filtered = allNotifications.filter((notif) => {
            const notifDate = moment(notif.timestamp);
            return notifDate.isAfter(now.clone().subtract(7, 'days'));
          });
          break;
        case 'last-month':
          filtered = allNotifications.filter((notif) => {
            const notifDate = moment(notif.timestamp);
            return notifDate.isAfter(now.clone().subtract(30, 'days'));
          });
          break;
        default:
          filtered = allNotifications;
      }

      setFilteredNotifications(filtered);
      setCurrentPage(1);
    },
    [allNotifications],
  );

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterNotifications(value);
  };

  // Re-filter when allNotifications changes
  useEffect(() => {
    filterNotifications(activeTab);
  }, [allNotifications, activeTab, filterNotifications]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex,
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }

    return pages;
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    // Reset notification count when viewing the page
    setNotificationCount(0);
  }, [fetchNotifications, setNotificationCount]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notifications
            </CardTitle>
            {socketNotifications.length > 0 && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="last-week">Last Week</TabsTrigger>
              <TabsTrigger value="last-month">Last Month</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <LoadingSkeleton />
              ) : currentNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
                    <Bell className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No notifications yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Real-time updates will appear here
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {currentNotifications.map((notification, index) => (
                      <div
                        key={`${notification.timestamp}-${index}`}
                        className="p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                notification.author.profileImage || undefined
                              }
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

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {formatDate.relativeTime(
                                  notification.timestamp,
                                )}
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
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              className={
                                currentPage === 1
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                            />
                          </PaginationItem>

                          {getPageNumbers().map((page, idx) => (
                            <PaginationItem key={idx}>
                              {page === '...' ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  onClick={() => setCurrentPage(page as number)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1),
                                )
                              }
                              className={
                                currentPage === totalPages
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
