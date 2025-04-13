import axiosInstance from "../api/axiosInstance"
import { API_ENDPOINTS } from "../api/Constants"

export const addNews = async (category) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADD_NEWS, category, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in add News:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
  }


  export const listNews = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LIST_NEWS);
      return response.data;
    } catch (error) {
      console.error("Error in List News:", error.response?.data || error.message);
      throw error;
    }
  };


  export const editNews = async (category) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.EDIT_NEWS, category, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in add News:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
  }

export const deleteNew = async (news_id) => {
  console.log("news_id-->>", news_id);
  
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.DELETE_NEWS, {
      data: { news_id },
    });
    console.log("response---->>", response);
    
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    return { result: false, message: "Delete failed" };
  }
};