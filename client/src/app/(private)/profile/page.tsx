"use client";

import React, { useEffect, useState } from "react";
import { AuthCheck } from "@/api/protected/auth.api";
import { getUserById } from "@/api/protected/user.api";
import ProfileForm from "@/components/forms/profile-form/profile.form";
import { UserResponse, UserData } from "@/interfaces/user-api.interface";
import { AuthCheckResponse } from "@/interfaces/auth-api.interface";
import { extractErrorMessage } from "@/configs/api.helper";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authData, setAuthData] = useState<AuthCheckResponse | null>(null);
  const [error, setError] = useState<string>("");
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
      setError("Auth Check failed. Redirect to login");
      router.replace("/login");
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

  return (
    <>
      <div>
        <ProfileForm profileData={userData} />
      </div>
    </>
  );
}
