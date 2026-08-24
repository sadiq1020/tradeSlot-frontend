import { apiClient } from "./client";
import { ApiResponse, Booking, BookingStatus, GetBookingsParams } from "@/types/api";

export const bookingsApi = {
  getBookings: async (
    params?: GetBookingsParams
  ): Promise<ApiResponse<Booking[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== "ALL") {
      queryParams.append("status", params.status);
    }
    if (params?.date) {
      queryParams.append("date", params.date);
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/bookings?${queryString}` : "/bookings";
    const response = await apiClient.get<ApiResponse<Booking[]>>(url);
    return response.data;
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (
    id: string,
    status: BookingStatus
  ): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.patch<ApiResponse<Booking>>(
      `/bookings/${id}/status`,
      { status }
    );
    return response.data;
  },

  cancelBooking: async (
    id: string,
    reason?: string
  ): Promise<ApiResponse<Booking>> => {
    const response = await apiClient.post<ApiResponse<Booking>>(
      `/bookings/${id}/cancel`,
      { reason }
    );
    return response.data;
  },
};
