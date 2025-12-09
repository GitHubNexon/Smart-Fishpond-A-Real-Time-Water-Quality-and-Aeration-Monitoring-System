export interface GetAllPaginatedParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: any;
}

export interface GetAllList {
  message: string;
  data: any | null;
}

export interface ErrorResponseMessage {
  message?: string | { message?: string };
}

export interface SuccessMessageResponse {
  message?: string | { message?: string };
  expiresAt: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface MessageResponse {
  message: string;
}


