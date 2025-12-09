'use client';
import React, { useEffect, useState } from 'react';
import { useOnlineUsers } from '@/providers/socket-provider';
import { getAllUsersList } from '@/api/protected/user.api';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Role {
  id: string;
  role: string;
  description: string;
}

interface User {
  id: string;
  profileImage: string | null;
  fullname: string;
  username: string;
  email: string;
  roleId: Role;
  createdAt: string;
}

interface UserWithStatus extends User {
  isOnline: boolean;
  connectedAt?: string;
}

export default function UserListOnline() {
  const { onlineUsers } = useOnlineUsers();
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const onlineUser = onlineUsers.find((ou) => ou.userId === user.id);
          return {
            ...user,
            isOnline: !!onlineUser,
            connectedAt: onlineUser?.connectedAt,
          };
        }),
      );
    }
  }, [onlineUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersList();

      if (response.data) {
        const usersWithStatus: UserWithStatus[] = response.data.map(
          (user: User) => {
            const onlineUser = onlineUsers.find((ou) => ou.userId === user.id);
            return {
              ...user,
              isOnline: !!onlineUser,
              connectedAt: onlineUser?.connectedAt,
            };
          },
        );
        setUsers(usersWithStatus);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort users: online first, then offline
  const sortedUsers = [...users].sort((a, b) => {
    if (a.isOnline === b.isOnline) return 0;
    return a.isOnline ? -1 : 1;
  });

  const onlineUsersList = users.filter((u) => u.isOnline);
  const offlineUsersList = users.filter((u) => !u.isOnline);

  const UserCard = ({ user }: { user: UserWithStatus }) => (
    <li className="p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* Avatar */}
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-10 h-10">
              {user.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.fullname} />
              ) : (
                <AvatarFallback>
                  {user.fullname
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Status Indicator */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
                user.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></span>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user.fullname}
              </p>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${
                  user.isOnline
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {user.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.username}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {user.roleId.role}
              </span>
              {user.isOnline && user.connectedAt && (
                <>
                  <span className="text-xs text-gray-300 dark:text-gray-600">
                    •
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Connected {new Date(user.connectedAt).toLocaleTimeString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email (hidden on small screens) */}
        <div className="hidden md:block text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
    </li>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
      <p className="text-lg">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-3 rounded-lg border border-border"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border mt-4 bg-white dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-indigo-300 dark:bg-indigo-500">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">User Status</h3>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium">
              {onlineUsersList.length} online
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium">
              {offlineUsersList.length} offline
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full m-2 ">
        <ScrollArea>
          <TabsList className="mb-3 ">
            <TabsTrigger value="all" className="group cursor-pointer">
              <Users
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              All
              <Badge
                className="ms-1.5 min-w-5 bg-primary/15 px-1"
                variant="secondary"
              >
                {users.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="online" className="group cursor-pointer">
              <CheckCircle2
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Online
              <Badge
                className="ms-1.5 min-w-5 bg-green-500/15 px-1 text-green-700 dark:text-green-400 transition-opacity group-data-[state=inactive]:opacity-50"
                variant="secondary"
              >
                {onlineUsersList.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="offline" className="group cursor-pointer">
              <XCircle
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Offline
              <Badge
                className="ms-1.5 min-w-5 bg-gray-500/15 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                variant="secondary"
              >
                {offlineUsersList.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <ScrollArea className="h-96" type="auto">
          <div className="max-h-96">
            <TabsContent value="all" className="m-0 p-2">
              {sortedUsers.length === 0 ? (
                <EmptyState message="No users found" />
              ) : (
                <ul className="space-y-1">
                  {sortedUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="online" className="m-0 p-2">
              {onlineUsersList.length === 0 ? (
                <EmptyState message="No users are currently online" />
              ) : (
                <ul className="space-y-1">
                  {onlineUsersList.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="offline" className="m-0 p-2">
              {offlineUsersList.length === 0 ? (
                <EmptyState message="All users are online" />
              ) : (
                <ul className="space-y-1">
                  {offlineUsersList.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </ul>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
