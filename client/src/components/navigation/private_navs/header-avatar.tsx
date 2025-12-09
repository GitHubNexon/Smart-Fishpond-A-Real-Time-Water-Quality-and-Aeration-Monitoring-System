'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCheckResponse } from '@/interfaces/auth-api.interface';
import { extractErrorMessage } from '@/configs/api.helper';
import { AuthCheck } from '@/api/protected/auth.api';
import { getUserById } from '@/api/protected/user.api';
import { UserResponse, UserData } from '@/interfaces/user-api.interface';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HeaderAvatar() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthCheckResponse | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetUser = async (id: string) => {
    try {
      const response = await getUserById(authData?.id);
      setUserData(response.data);
    } catch (error: unknown) {
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCheck = async () => {
    setLoading(true);
    try {
      const response = await AuthCheck();
      setAuthData(response);
      return response;
    } catch (error: unknown) {
      console.log(extractErrorMessage(error));
      setError('Auth Check failed. Redirect to login');
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleAuthCheck();
  }, []);

  useEffect(() => {
    if (authData?.id) {
      handleGetUser(authData?.id);
    }
  }, [authData]);

  // Helper to get initials
  const getInitials = (fullname: string) => {
    return fullname
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading || !authData) {
    return (
      <Avatar>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar
      className="cursor-pointer hover:opacity-80 transition border-1 border-primary rounded-full"
      onClick={() => router.push('/profile')}
    >
      {/* If you have profile image URL from authData, replace AvatarImage src */}
      <AvatarImage
        src={userData?.profileImage || ''}
        alt={userData?.fullname}
      />
      <AvatarFallback className="bg-muted text-sm font-medium text-foreground">
        {userData?.fullname ? getInitials(userData.fullname) : '?'}
      </AvatarFallback>
    </Avatar>
  );
}
