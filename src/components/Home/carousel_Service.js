import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/Constants";

export const banner = async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BANNER);
    return response.data;
  };