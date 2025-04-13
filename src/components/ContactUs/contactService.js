import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/Constants";

export const contact = async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CONTACT, data);
    return response.data;
  };