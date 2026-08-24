import { useMutation } from "@tanstack/react-query";
import { webchatApi } from "@/lib/api/webchat";
import { paymentsApi } from "@/lib/api/payments";
import { WebchatMessageInput } from "@/types/api";

export function useSendWebchatMessage() {
  return useMutation({
    mutationFn: (data: WebchatMessageInput) => webchatApi.sendMessage(data),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (bookingId: string) => paymentsApi.createCheckoutSession(bookingId),
    onSuccess: (response: any) => {
      const checkoutUrl =
        response?.data?.checkoutUrl ||
        response?.data?.url ||
        response?.checkoutUrl ||
        response?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    },
  });
}
