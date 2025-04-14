import axiosInstance from "../api/axiosInstance"
import { API_ENDPOINTS } from "../api/Constants"



export const listCategory = async () => {
  try {
      const response = await axiosInstance.get(API_ENDPOINTS.LIST_CATEGORY)
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in addCategory:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
}
export const listNewsByCategory = async (data) => {
  try {
      const response = await axiosInstance.post(API_ENDPOINTS.LIST_ARTICLE,data)
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in addCategory:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
}
export const listNews = async () => {
  try {
      const response = await axiosInstance.get(API_ENDPOINTS.LIST_ARTICLE)
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in addCategory:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
}

export const getads = async () => {
  try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_ADS)
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in addCategory:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
}

export const getBanner = async () => {
  try {
      const response = await axiosInstance.get(API_ENDPOINTS.LIST_BANNER)
      console.log("Success response:", response.data)
      return response.data
    } catch (error) {
      console.error("Error in addCategory:", error.response?.data || error.message)
      throw error // rethrow to be caught in handleSubmit
    }
}

