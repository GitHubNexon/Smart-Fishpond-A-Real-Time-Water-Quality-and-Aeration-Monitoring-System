'use client';

import axios from '@/configs/axios-instance-client';
import { handleRequest, extractErrorMessage } from '@/configs/api.helper';
import {
  AuthResponse,
  AuthRequest,
  AuthCheckResponse,
  GetAllPaginatedAuthLogs,
  PasskeyResponse,
} from '@/interfaces/auth-api.interface';
import {
  GetAllPaginatedParams,
  MessageResponse,
} from '@/interfaces/shared-api.interface';

/*
 * method: [POST]
 * parameters: none
 * request: ["email", "password"]
 * response:
 */
export async function Auth(authRequest: AuthRequest): Promise<AuthResponse> {
  return handleRequest(axios.post<AuthResponse>('/auth/sign-in', authRequest));
}

export async function AuthCheck(): Promise<AuthCheckResponse> {
  return handleRequest(axios.post<AuthCheckResponse>('/auth/check'));
}

export async function AuthLogOut(): Promise<void> {
  return handleRequest(axios.post<void>('/auth/logout'));
}

export async function UnlockAccount(email: string): Promise<MessageResponse> {
  return handleRequest(axios.post<MessageResponse>('/auth/unlock', { email }));
}

export async function GetAllAuthLogsPaginated(
  id: string,
  params: GetAllPaginatedParams,
): Promise<GetAllPaginatedAuthLogs> {
  return handleRequest(
    axios.get(`/auth/user-logs/${id}`, {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    }),
  );
}

export async function VerifyPasskey(
  userId: string,
  passKey: string,
): Promise<PasskeyResponse> {
  return handleRequest(
    axios.post('/auth/verify-passkey', {
      userId,
      passKey,
    }),
  );
}

export async function AuthLogOutAllDevices(
  userId: string,
): Promise<MessageResponse> {
  return handleRequest(
    axios.post<MessageResponse>(`/auth/logout-all/${userId}`),
  );
}

