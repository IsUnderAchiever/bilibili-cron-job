/** User entity returned by the API */
export interface User {
  id: number;
  name: string;
  email: string;
}

/** Unified API response wrapper */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** Request body for creating a new user */
export interface CreateUserRequest {
  name: string;
  email: string;
}
