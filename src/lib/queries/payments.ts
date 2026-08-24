import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments";

export const PAYMENT_KEYS = {
  connectStatus: ["payments", "connectStatus"] as const,
};

export function useConnectStatus() {
  return useQuery({
    queryKey: PAYMENT_KEYS.connectStatus,
    queryFn: async () => {
      const response = await paymentsApi.getConnectStatus();
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateConnectOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => paymentsApi.createConnectOnboardingUrl(),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.connectStatus });
      const targetUrl =
        response?.data?.onboardingUrl ||
        response?.data?.url ||
        response?.onboardingUrl ||
        response?.url;

      if (targetUrl) {
        window.location.href = targetUrl;
      }
    },
  });
}
