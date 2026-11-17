// Shared API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  statusCode: number;
  timestamp: string;
  message?: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
// add: ErrorResponse type
