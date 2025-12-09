"use server";

// import axios from "@/configs/axios-instance-client";
import ServerAxiosInit from "@/configs/axios-instance-server";
import { handleRequest, extractErrorMessage } from "@/configs/api.helper";
import {
  AuthResponse,
  AuthRequest,
  AuthCheckResponse,
} from "@/interfaces/auth-api.interface";


export async function AuthCheck(): Promise<AuthCheckResponse> {
  const axiosInstance = await ServerAxiosInit();
  return handleRequest(axiosInstance.post<AuthCheckResponse>("/auth/check"));
}


export async function Auth(authRequest: AuthRequest): Promise<AuthResponse> {
  const axiosInstance = await ServerAxiosInit();
  return handleRequest(axiosInstance.post<AuthResponse>("/auth/sign-in", authRequest));
}
