import { apiClient } from "./client";
import { ApiResponse, WebchatMessageInput, WebchatMessageResponse } from "@/types/api";

export const webchatApi = {
  sendMessage: async (
    data: WebchatMessageInput
  ): Promise<ApiResponse<WebchatMessageResponse>> => {
    const response = await apiClient.post<ApiResponse<WebchatMessageResponse>>(
      "/webchat/message",
      data
    );
    return response.data;
  },
};
