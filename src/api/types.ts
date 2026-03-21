export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  results: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiException";
  }
}
