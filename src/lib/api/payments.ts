import { apiClient } from "./client";
import {
  ApiResponse,
  CheckoutResponse,
  StripeConnectStatus,
  StripeOnboardResponse,
} from "@/types/api";

export const paymentsApi = {
  getConnectStatus: async (): Promise<ApiResponse<StripeConnectStatus>> => {
    const response = await apiClient.get<ApiResponse<StripeConnectStatus>>(
      "/payments/connect/status"
    );
    return response.data;
  },

  createConnectOnboardingUrl: async (): Promise<
    ApiResponse<StripeOnboardResponse>
  > => {
    const response = await apiClient.post<ApiResponse<StripeOnboardResponse>>(
      "/payments/connect/onboard"
    );
    return response.data;
  },

  createCheckoutSession: async (
    bookingId: string
  ): Promise<ApiResponse<CheckoutResponse>> => {
    const response = await apiClient.post<ApiResponse<CheckoutResponse>>(
      "/payments/checkout",
      { bookingId }
    );
    return response.data;
  },
};
