import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/Constants";

export const ads_news = async (data) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADS, data);
    return response.data;
  };