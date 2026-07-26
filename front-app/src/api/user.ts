import request from "./request";
import type { User, ApiResponse, CreateUserRequest } from "../types/user";

/**
 * Health check — verifies the backend is reachable.
 */
export async function healthCheck(): Promise<{ status: string }> {
  return request.get("/api/v1/health");
}

/**
 * Fetch the full list of mock users from the backend.
 */
export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  return request.get("/api/v1/users");
}

/**
 * Create a new user.
 *
 * @param name  — display name
 * @param email — email address
 * @returns the created user object (includes the server-assigned ID)
 */
export async function createUser(
  name: string,
  email: string,
): Promise<ApiResponse<User>> {
  const body: CreateUserRequest = { name, email };
  return request.post("/api/v1/users", body);
}
