//src/configs/axiosClientInstance-private.ts

'use client';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from 'axios';
import { API_BASE_URL } from './different-domain-config';
import { memoryToken } from '@/utils/memory-token';
import Cookies from 'js-cookie';

// Extend Axios config for retry logic
interface CustomRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Backend error shape
interface AxiosErrorResponse {
  message?: string | string[] | { message?: string };
}

const axiosClientInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Immediately try to refresh token if memoryToken is empty
(async () => {
  if (typeof window !== 'undefined') {
    if (!memoryToken.get()) {
      try {
        const res = await axiosClientInstance.post<{ accessToken: string }>(
          '/auth/refresh',
          {},
          { withCredentials: true },
        );

        if (res.data.accessToken) {
          memoryToken.set(res.data.accessToken);
        }
      } catch (err) {
        console.warn('Auto-refresh failed:', err);
        memoryToken.clear();
      }
    }
  }
})();

/*
axiosClientInstance.interceptors.request.use((config) => {
  const token = memoryToken.get();
  config.headers = config.headers || ({} as AxiosRequestHeaders);

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const xsrfToken = Cookies.get('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  config.withCredentials = true;

  return config;
});
*/

axiosClientInstance.interceptors.request.use((config) => {
  const token = memoryToken.get();
  config.headers = config.headers || ({} as AxiosRequestHeaders);

  const url = config.url || '';
  const method = config.method?.toUpperCase();

  const authRoutes = [
    '/auth/refresh',
    '/auth/check',
    '/auth/sign-in',

    '/auth/logout',
    '/auth/verify-passkey',
    '/auth/register',
  ];

  const isAuthRoute = authRoutes.some((path) => url.includes(path));

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (
    !isAuthRoute &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '')
  ) {
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
  }

  config.withCredentials = true;
  return config;
});

// Response interceptor to handle errors and refresh token
axiosClientInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      console.error('Unexpected error:', error);
      return Promise.reject(error);
    }

    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as CustomRequestConfig;

    // Normalize backend error message
    const data = axiosError.response?.data as AxiosErrorResponse | undefined;
    let errMsg: string;
    if (typeof data?.message === 'string') errMsg = data.message;
    else if (Array.isArray(data?.message)) errMsg = data.message.join(', ');
    else if (typeof data?.message === 'object' && data.message?.message)
      errMsg = data.message.message;
    else errMsg = axiosError.message || 'Server Error';

    console.error('API Error:', errMsg);

    // Auto-refresh token if 401 and not already retried and not the refresh endpoint itself
    if (
      axiosError.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosClientInstance.post<{ accessToken: string }>(
          '/auth/refresh',
          {},
          { withCredentials: true },
        );
        const { accessToken } = res.data;
        if (accessToken) {
          memoryToken.set(accessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosClientInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        memoryToken.clear();
      }
    }

    // return Promise.reject(new Error(errMsg));
    return Promise.reject(error);
  },
);

export default axiosClientInstance;
