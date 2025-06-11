import { getAccessToken, removeAccessToken } from "@/hooks/useAuth";
import axios, { AxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

interface CustomAxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
}

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_APP_API_URL,
  timeout: 10000, // 10 seconds timeout
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.log("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      removeAccessToken();

      Alert.alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

      router.navigate("/auth/login");
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  async function (config) {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const request = axiosInstance as unknown as CustomAxiosInstance;

export default request;
