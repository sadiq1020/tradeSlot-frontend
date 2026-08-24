import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import { BookingStatus, GetBookingsParams } from "@/types/api";

export const BOOKING_KEYS = {
  all: ["bookings"] as const,
  list: (params?: GetBookingsParams) => ["bookings", "list", params] as const,
  detail: (id: string) => ["bookings", "detail", id] as const,
};

/**
 * Hook to fetch bookings with optional filters
 */
export function useBookings(params?: GetBookingsParams) {
  return useQuery({
    queryKey: BOOKING_KEYS.list(params),
    queryFn: async () => {
      const response = await bookingsApi.getBookings(params);
      return response.data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch a single booking by ID
 */
export function useBooking(id: string | null) {
  return useQuery({
    queryKey: BOOKING_KEYS.detail(id || ""),
    queryFn: async () => {
      if (!id) return null;
      const response = await bookingsApi.getBookingById(id);
      return response.data || null;
    },
    enabled: Boolean(id),
  });
}

/**
 * Hook to update booking status
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingsApi.updateBookingStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.detail(variables.id),
      });
    },
  });
}

/**
 * Hook to cancel a booking
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsApi.cancelBooking(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BOOKING_KEYS.detail(variables.id),
      });
    },
  });
}
