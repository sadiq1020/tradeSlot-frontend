import { apiClient } from "./client";
import { ApiResponse, CreateWorkAreaInput, WorkArea } from "@/types/api";

export const workAreasApi = {
  getWorkAreas: async (): Promise<ApiResponse<WorkArea[]>> => {
    const response = await apiClient.get<ApiResponse<WorkArea[]>>("/work-areas");
    return response.data;
  },

  createWorkArea: async (
    data: CreateWorkAreaInput
  ): Promise<ApiResponse<WorkArea>> => {
    const response = await apiClient.post<ApiResponse<WorkArea>>(
      "/work-areas",
      data
    );
    return response.data;
  },
};
