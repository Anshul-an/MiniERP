export interface PaginationOptions {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
