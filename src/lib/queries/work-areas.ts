import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workAreasApi } from "@/lib/api/work-areas";
import { CreateWorkAreaInput } from "@/types/api";

export const WORK_AREA_KEYS = {
  all: ["work-areas"] as const,
};

/**
 * Hook to fetch all set work areas
 */
export function useWorkAreas() {
  return useQuery({
    queryKey: WORK_AREA_KEYS.all,
    queryFn: async () => {
      const response = await workAreasApi.getWorkAreas();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to create a work area for a given date
 */
export function useCreateWorkArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkAreaInput) => workAreasApi.createWorkArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORK_AREA_KEYS.all });
    },
  });
}
