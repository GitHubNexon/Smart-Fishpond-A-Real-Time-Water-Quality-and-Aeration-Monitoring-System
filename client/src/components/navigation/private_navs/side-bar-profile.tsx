'use client';

import React, { useState, useContext } from 'react';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import { FaSignOutAlt, FaUser, FaCog, FaBell } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AuthLogOut } from '@/api/protected/auth.api';
import { Separator } from '@/components/ui/separator';
import { FaEllipsisV } from 'react-icons/fa';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import SystemPageContent from '@/components/pages/system-page.content';
import { useOnlineUsers } from '@/providers/socket-provider';
import { showToastSuccess, showToastError } from '@/utils/toast-config';
import { extractErrorMessage } from '@/configs/api.helper';

export default function SideBarProfile({ isOpen }: { isOpen: boolean }) {
  const { disconnectUser } = useOnlineUsers();
  const { user } = useAuthCheck();
  const router = useRouter();
  const [systemOpen, setSystemOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await AuthLogOut();
      disconnectUser();
      localStorage.clear();
      showToastSuccess('Logout', 'Logout Succesfully', 'top-center');
      router.replace('/');
    } catch (error: unknown) {
      console.error('Error Authentication Logout', extractErrorMessage(error));
      showToastError(
        'Logout Failed',
        extractErrorMessage(error),
        'bottom-right',
      );
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="mt-auto">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`bg-zinc-300 flex items-center space-x-3 w-full p-2 rounded-md cursor-pointer  text-black hover:grayscale hover:bg-neutral-700 hover:opacity-50 transition-opacity duration-200 ${
                isOpen ? 'justify-start pl-5' : 'justify-center'
              }`}
            >
              <img
                src={user.profileImage || '/default-avatar.png'}
                alt="Avatar"
                className="h-8 w-8 rounded object-cover"
              />
              {isOpen && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col text-left break-words max-w-[120px]">
                    <span className="font-semibold text-xs">
                      {user.fullname}
                    </span>
                    <span className="text-xs break-words">{user.email}</span>
                  </div>
                  <div className="p-1 cursor-pointer hover:bg-gray-700 rounded-full">
                    <FaEllipsisV size={14} />
                  </div>
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={8}
            className="p-0"
          >
            <div className="flex items-center space-x-3 px-4 py-3">
              <img
                src={user.profileImage || '/default-avatar.png'}
                alt="Avatar"
                className="h-10 w-10 rounded object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm">{user.fullname}</span>
                <span className="text-xs">{user.email}</span>
              </div>
            </div>

            <Separator />
            <button
              className="cursor-pointer flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700"
              onClick={() => router.push('/account')}
            >
              <FaUser />
              <span>Account</span>
            </button>
            <button
              className="cursor-pointer flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700"
              onClick={() => setSystemOpen(true)}
            >
              <FaCog />
              <span>System Preference</span>
            </button>

            <button
              className="cursor-pointer flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700"
              onClick={() => router.push('/notifications')}
            >
              <FaBell />
              <span>Notifications</span>
            </button>
            <Separator />
            <button
              className="cursor-pointer flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {systemOpen && (
        <SystemPageContent open={systemOpen} onOpenChange={setSystemOpen} />
      )}
    </>
  );
}
