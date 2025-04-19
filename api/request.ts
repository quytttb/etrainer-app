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
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response.status === 401) {
      removeAccessToken();

      Alert.alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

      router.navigate("/auth/login");
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
