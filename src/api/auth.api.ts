import { apiClient } from "./apiClient";
import type { AuthResponse } from "@/types/auth";

export const authApi = {
  login: (credentials: any) =>
    apiClient.post<AuthResponse>("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  refresh_token: (data: { refresh_token: string }) => apiClient.post("/auth/refresh", data),
  forgotPassword: (data: { identifier: string; type: "email" | "mobile" }) =>
    apiClient.post("/auth/forgot-password", data),
  sendOtp: (data: { email: string }) => apiClient.post("/auth/send-otp", data),
  verifyOtp: (data: { email: string; otp: string }) =>
    apiClient.post<AuthResponse>("/auth/verify-otp", data),
};
