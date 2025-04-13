import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/Constants";

export const ourteam = async (data) => {
    const response = await axiosInstance.get(API_ENDPOINTS.TEAM, data);
    return response.data;
  };