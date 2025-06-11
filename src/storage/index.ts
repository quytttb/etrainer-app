import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Storage interfaces
export interface StorageOptions {
     secure?: boolean;
     expirationTime?: number; // in milliseconds
}

export interface StorageItem<T = any> {
     value: T;
     timestamp: number;
     expirationTime?: number;
}

// Storage Keys (centralized)
export const STORAGE_KEYS = {
     // Auth related
     ACCESS_TOKEN: 'auth_access_token',
     REFRESH_TOKEN: 'auth_refresh_token',
     USER_DATA: 'auth_user_data',
     LOGIN_CREDENTIALS: 'auth_login_credentials',

     // App state
     THEME_PREFERENCE: 'app_theme_preference',
     LANGUAGE_PREFERENCE: 'app_language_preference',
     NOTIFICATION_SETTINGS: 'app_notification_settings',

     // Journey data
     JOURNEY_PROGRESS: 'journey_progress',
     CURRENT_STAGE: 'journey_current_stage',
     COMPLETED_LESSONS: 'journey_completed_lessons',
     JOURNEY_CACHE: 'journey_cache',

     // User preferences
     AUDIO_SETTINGS: 'user_audio_settings',
     STUDY_PREFERENCES: 'user_study_preferences',
     PRACTICE_HISTORY: 'user_practice_history',

     // App cache
     API_CACHE: 'app_api_cache',
     IMAGE_CACHE: 'app_image_cache',
     OFFLINE_DATA: 'app_offline_data',
} as const;

// Storage service class
export class StorageService {

     // ===== SECURE STORAGE METHODS =====

     /**
      * Store sensitive data securely
      */
     async setSecure<T>(key: string, value: T, options?: StorageOptions): Promise<void> {
          try {
               const item: StorageItem<T> = {
                    value,
                    timestamp: Date.now(),
                    expirationTime: options?.expirationTime,
               };

               const serializedValue = JSON.stringify(item);
               await SecureStore.setItemAsync(key, serializedValue);
          } catch (error) {
               console.error(`Error storing secure data for key ${key}:`, error);
               throw new Error(`Failed to store secure data: ${key}`);
          }
     }

     /**
      * Get sensitive data from secure storage
      */
     async getSecure<T>(key: string): Promise<T | null> {
          try {
               const serializedValue = await SecureStore.getItemAsync(key);
               if (!serializedValue) {
                    return null;
               }

               const item: StorageItem<T> = JSON.parse(serializedValue);

               // Check if item has expired
               if (item.expirationTime && Date.now() > item.timestamp + item.expirationTime) {
                    await this.removeSecure(key);
                    return null;
               }

               return item.value;
          } catch (error) {
               console.error(`Error getting secure data for key ${key}:`, error);
               return null;
          }
     }

     /**
      * Remove sensitive data from secure storage
      */
     async removeSecure(key: string): Promise<void> {
          try {
               await SecureStore.deleteItemAsync(key);
          } catch (error) {
               console.error(`Error removing secure data for key ${key}:`, error);
          }
     }

     // ===== REGULAR STORAGE METHODS =====

     /**
      * Store regular data
      */
     async set<T>(key: string, value: T, options?: StorageOptions): Promise<void> {
          try {
               if (options?.secure) {
                    return this.setSecure(key, value, options);
               }

               const item: StorageItem<T> = {
                    value,
                    timestamp: Date.now(),
                    expirationTime: options?.expirationTime,
               };

               const serializedValue = JSON.stringify(item);
               await AsyncStorage.setItem(key, serializedValue);
          } catch (error) {
               console.error(`Error storing data for key ${key}:`, error);
               throw new Error(`Failed to store data: ${key}`);
          }
     }

     /**
      * Get regular data
      */
     async get<T>(key: string): Promise<T | null> {
          try {
               const serializedValue = await AsyncStorage.getItem(key);
               if (!serializedValue) {
                    return null;
               }

               const item: StorageItem<T> = JSON.parse(serializedValue);

               // Check if item has expired
               if (item.expirationTime && Date.now() > item.timestamp + item.expirationTime) {
                    await this.remove(key);
                    return null;
               }

               return item.value;
          } catch (error) {
               console.error(`Error getting data for key ${key}:`, error);
               return null;
          }
     }

     /**
      * Remove regular data
      */
     async remove(key: string): Promise<void> {
          try {
               await AsyncStorage.removeItem(key);
          } catch (error) {
               console.error(`Error removing data for key ${key}:`, error);
          }
     }

     // ===== BATCH OPERATIONS =====

     /**
      * Store multiple items
      */
     async setMultiple<T>(items: Array<[string, T]>, options?: StorageOptions): Promise<void> {
          try {
               const promises = items.map(([key, value]) => this.set(key, value, options));
               await Promise.all(promises);
          } catch (error) {
               console.error('Error storing multiple items:', error);
               throw new Error('Failed to store multiple items');
          }
     }

     /**
      * Get multiple items
      */
     async getMultiple<T>(keys: string[]): Promise<Array<[string, T | null]>> {
          try {
               const promises = keys.map(async (key) => {
                    const value = await this.get<T>(key);
                    return [key, value] as [string, T | null];
               });

               return Promise.all(promises);
          } catch (error) {
               console.error('Error getting multiple items:', error);
               return keys.map(key => [key, null]);
          }
     }

     /**
      * Remove multiple items
      */
     async removeMultiple(keys: string[]): Promise<void> {
          try {
               const promises = keys.map(key => this.remove(key));
               await Promise.all(promises);
          } catch (error) {
               console.error('Error removing multiple items:', error);
          }
     }

     // ===== UTILITY METHODS =====

     /**
      * Clear all data
      */
     async clear(): Promise<void> {
          try {
               await AsyncStorage.clear();
               // Note: SecureStore doesn't have a clear all method
               // Individual secure items need to be removed manually
          } catch (error) {
               console.error('Error clearing storage:', error);
          }
     }

     /**
      * Get all keys
      */
     async getAllKeys(): Promise<string[]> {
          try {
               return await AsyncStorage.getAllKeys();
          } catch (error) {
               console.error('Error getting all keys:', error);
               return [];
          }
     }

     /**
      * Get storage size info
      */
     async getStorageSize(): Promise<{ keys: number; approximate_size: string }> {
          try {
               const keys = await this.getAllKeys();
               return {
                    keys: keys.length,
                    approximate_size: `${keys.length} items stored`,
               };
          } catch (error) {
               console.error('Error getting storage size:', error);
               return { keys: 0, approximate_size: '0 items stored' };
          }
     }

     // ===== AUTH SPECIFIC METHODS =====

     async setAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
          await Promise.all([
               this.setSecure(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
               this.setSecure(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
          ]);
     }

     async getAuthTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
          const [accessToken, refreshToken] = await Promise.all([
               this.getSecure<string>(STORAGE_KEYS.ACCESS_TOKEN),
               this.getSecure<string>(STORAGE_KEYS.REFRESH_TOKEN),
          ]);

          return { accessToken, refreshToken };
     }

     async clearAuthTokens(): Promise<void> {
          await Promise.all([
               this.removeSecure(STORAGE_KEYS.ACCESS_TOKEN),
               this.removeSecure(STORAGE_KEYS.REFRESH_TOKEN),
               this.remove(STORAGE_KEYS.USER_DATA),
          ]);
     }

     // ===== CACHE METHODS =====

     async setCache<T>(key: string, value: T, ttl: number = 3600000): Promise<void> { // Default 1 hour
          await this.set(key, value, { expirationTime: ttl });
     }

     async getCache<T>(key: string): Promise<T | null> {
          return this.get<T>(key);
     }

     async clearCache(): Promise<void> {
          const keys = await this.getAllKeys();
          const cacheKeys = keys.filter(key => key.includes('cache'));
          await this.removeMultiple(cacheKeys);
     }
}

// Create and export singleton instance
export const storageService = new StorageService();

// Export types
export type { StorageItem as StorageItemType, StorageOptions as StorageOptionsType };

// Export for use in components
export default storageService; 