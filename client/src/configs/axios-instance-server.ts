'use server';
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_BASE_URL } from './different-domain-config';
import { cookies } from 'next/headers';

interface CustomRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Create a server-side Axios instance for SSR
 * @param cookieTokens - HttpOnly cookies from the Request
 */
export async function ServerAxiosInit() {
  const cookieStore = await cookies();

  const mainToken = cookieStore.get('_auth_token_')?.value;
  const passkeyToken =
    cookieStore.get('_passkey_token_')?.value ||
    cookieStore.get(process.env.PASSKEY_TOKEN_NAME ?? '_passkey_token_')?.value;

  const cookieHeader = [
    mainToken ? `_auth_token_=${mainToken}` : '',
    passkeyToken ? `_passkey_token_=${passkeyToken}` : '',
  ]
    .filter(Boolean)
    .join('; ');

  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  instance.interceptors.request.use(async (config) => {
    if (!config.headers) {
      config.headers = {} as AxiosHeaders;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: unknown) => {
      if (!(error instanceof AxiosError)) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as CustomRequestConfig;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        mainToken
      ) {
        originalRequest._retry = true;
        try {
          const refreshRes = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: { Cookie: `_auth_token_=${mainToken}` },
              withCredentials: true,
            },
          );

          const newAccessToken = refreshRes.data.accessToken;

          if (newAccessToken) {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            return instance(originalRequest);
          }
        } catch (refreshErr) {
          console.error('Refresh token failed:', refreshErr);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

export default ServerAxiosInit;
