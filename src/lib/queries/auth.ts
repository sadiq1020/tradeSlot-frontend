import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { LoginInput, User } from "@/types/api";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

/**
 * Hook to fetch the currently authenticated trader/user
 */
export function useMe() {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      const response = await authApi.getMe();
      return response.data || null;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data?.data?.user) {
        queryClient.setQueryData(AUTH_KEYS.me, data.data.user);
      } else {
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      }
      router.push("/dashboard/bookings");
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.me, null);
      queryClient.clear();
      router.push("/login");
    },
    onError: () => {
      queryClient.setQueryData(AUTH_KEYS.me, null);
      router.push("/login");
    },
  });
}
