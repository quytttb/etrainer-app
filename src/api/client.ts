import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Configuration
const API_CONFIG = {
     BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:3000/api',
     TIMEOUT: 15000,
     RETRY_ATTEMPTS: 3,
     RETRY_DELAY: 1000,
};

// Response interfaces
export interface ApiResponse<T = any> {
     success: boolean;
     data: T;
     message?: string;
     error?: string;
     pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
     };
}

export interface ApiError {
     message: string;
     status: number;
     code?: string;
     details?: any;
}

// Token management
class TokenManager {
     private static readonly TOKEN_KEY = 'auth_token';
     private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

     static async getToken(): Promise<string | null> {
          try {
               return await SecureStore.getItemAsync(this.TOKEN_KEY);
          } catch (error) {
               console.error('Error getting token:', error);
               return null;
          }
     }

     static async setToken(token: string): Promise<void> {
          try {
               await SecureStore.setItemAsync(this.TOKEN_KEY, token);
          } catch (error) {
               console.error('Error setting token:', error);
          }
     }

     static async getRefreshToken(): Promise<string | null> {
          try {
               return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
          } catch (error) {
               console.error('Error getting refresh token:', error);
               return null;
          }
     }

     static async setRefreshToken(token: string): Promise<void> {
          try {
               await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token);
          } catch (error) {
               console.error('Error setting refresh token:', error);
          }
     }

     static async clearTokens(): Promise<void> {
          try {
               await SecureStore.deleteItemAsync(this.TOKEN_KEY);
               await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
          } catch (error) {
               console.error('Error clearing tokens:', error);
          }
     }
}

// API Client Class
export class ApiClient {
     private client: AxiosInstance;
     private isRefreshing = false;
     private failedQueue: Array<{
          resolve: (token: string) => void;
          reject: (error: any) => void;
     }> = [];

     constructor() {
          this.client = axios.create({
               baseURL: API_CONFIG.BASE_URL,
               timeout: API_CONFIG.TIMEOUT,
               headers: {
                    'Content-Type': 'application/json',
               },
          });

          this.setupInterceptors();
     }

     private setupInterceptors(): void {
          // Request interceptor - Add auth token
          this.client.interceptors.request.use(
               async (config: InternalAxiosRequestConfig) => {
                    const token = await TokenManager.getToken();
                    if (token && config.headers) {
                         config.headers.Authorization = `Bearer ${token}`;
                    }

                    // Add request logging in development
                    if (__DEV__) {
                         console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                         if (config.data) {
                              console.log('📄 Request Data:', config.data);
                         }
                    }

                    return config;
               },
               (error) => {
                    console.error('❌ Request Error:', error);
                    return Promise.reject(error);
               }
          );

          // Response interceptor - Handle responses and token refresh
          this.client.interceptors.response.use(
               (response) => {
                    // Log successful responses in development
                    if (__DEV__) {
                         console.log(`✅ API Response: ${response.status} ${response.config.url}`);
                    }
                    return response;
               },
               async (error: AxiosError) => {
                    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                    // Handle 401 errors with token refresh
                    if (error.response?.status === 401 && !originalRequest._retry) {
                         if (this.isRefreshing) {
                              // Queue the request while refreshing
                              return new Promise((resolve, reject) => {
                                   this.failedQueue.push({ resolve, reject });
                              }).then((token) => {
                                   if (originalRequest.headers) {
                                        originalRequest.headers.Authorization = `Bearer ${token}`;
                                   }
                                   return this.client(originalRequest);
                              }).catch((err) => {
                                   return Promise.reject(err);
                              });
                         }

                         originalRequest._retry = true;
                         this.isRefreshing = true;

                         try {
                              const refreshToken = await TokenManager.getRefreshToken();
                              if (refreshToken) {
                                   const response = await this.refreshTokenRequest(refreshToken);
                                   const newToken = response.data.accessToken;

                                   await TokenManager.setToken(newToken);

                                   // Process failed queue
                                   this.processQueue(null, newToken);

                                   // Retry original request
                                   if (originalRequest.headers) {
                                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                   }
                                   return this.client(originalRequest);
                              }
                         } catch (refreshError) {
                              // Refresh failed, logout user
                              this.processQueue(refreshError, null);
                              await TokenManager.clearTokens();
                              // Emit logout event or navigate to login
                              // EventBus.emit('auth:logout');
                         } finally {
                              this.isRefreshing = false;
                         }
                    }

                    // Handle other errors
                    const apiError: ApiError = {
                         message: (error.response?.data as any)?.message || error.message,
                         status: error.response?.status || 0,
                         code: (error.response?.data as any)?.code,
                         details: error.response?.data,
                    };

                    console.error('❌ API Error:', apiError);
                    return Promise.reject(apiError);
               }
          );
     }

     private async refreshTokenRequest(refreshToken: string): Promise<AxiosResponse> {
          return axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
               refreshToken,
          });
     }

     private processQueue(error: any, token: string | null): void {
          this.failedQueue.forEach(({ resolve, reject }) => {
               if (error) {
                    reject(error);
               } else {
                    resolve(token!);
               }
          });

          this.failedQueue = [];
     }

     // Generic request methods
     async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
          const response = await this.client.get<ApiResponse<T>>(url, config);
          return response.data;
     }

     async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
          const response = await this.client.post<ApiResponse<T>>(url, data, config);
          return response.data;
     }

     async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
          const response = await this.client.put<ApiResponse<T>>(url, data, config);
          return response.data;
     }

     async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
          const response = await this.client.patch<ApiResponse<T>>(url, data, config);
          return response.data;
     }

     async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
          const response = await this.client.delete<ApiResponse<T>>(url, config);
          return response.data;
     }

     // File upload method
     async uploadFile<T>(
          url: string,
          file: FormData,
          onUploadProgress?: (progressEvent: any) => void
     ): Promise<ApiResponse<T>> {
          const response = await this.client.post<ApiResponse<T>>(url, file, {
               headers: {
                    'Content-Type': 'multipart/form-data',
               },
               onUploadProgress,
          });
          return response.data;
     }

     // Download file method
     async downloadFile(url: string, filename: string): Promise<void> {
          const response = await this.client.get(url, {
               responseType: 'blob',
          });

          // Handle file download (React Native specific implementation needed)
          // This is a placeholder for actual download implementation
          console.log('File download initiated:', filename);
     }

     // Get raw axios instance for special cases
     getAxiosInstance(): AxiosInstance {
          return this.client;
     }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export token manager for external use
export { TokenManager };

// Export types
export type { AxiosRequestConfig, AxiosResponse, AxiosError }; 