import axios from "axios";
import { message } from "antd";

/**
 * Axios instance with pre-configured base URL and interceptors.
 *
 * - baseURL points to the Go Gin backend.
 * - Request interceptor logs outgoing requests.
 * - Response interceptor unwraps data on success and shows error messages on failure.
 */
const request = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- Request interceptor -----
request.interceptors.request.use(
  (config) => {
    // You can attach tokens or log requests here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ----- Response interceptor -----
request.interceptors.response.use(
  (response) => {
    // Axios wraps the real response in `data` — unwrap it so callers get the API body directly.
    return response.data;
  },
  (error) => {
    // Extract a human-readable message from the error
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Network error";
    message.error(msg);
    return Promise.reject(error);
  },
);

export default request;
