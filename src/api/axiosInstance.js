import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log("apiUrl---->>",apiUrl)


const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("request was sent", config);
    return config;
  },
  (error) => {
    console.log("error in sending request", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("received the response", response);
    return response;
  },
  (error) => {
    console.log("error in receiving response", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
