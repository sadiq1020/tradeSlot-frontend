import { apiClient } from "./client";
import { ApiResponse, AuthResponse, LoginInput, User } from "@/types/api";

export const authApi = {
  login: async (credentials: LoginInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      "/auth/logout"
    );
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  refresh: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/refresh");
    return response.data;
  },
};
