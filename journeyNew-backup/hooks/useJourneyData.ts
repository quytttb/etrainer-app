import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JourneyNewService } from '../service';
import { JourneyNewOverview, JourneyNewStage } from '../types';
import { STORAGE_KEYS, APP_CONSTANTS } from '../utils/config';
import useAuth from '../../../hooks/useAuth';

interface JourneyDataState {
     overview: JourneyNewOverview | null;
     stages: JourneyNewStage[];
     loading: boolean;
     error: string | null;
     lastUpdated: number | null;
     isAuthenticated: boolean;
}

interface UseJourneyDataReturn extends JourneyDataState {
     refreshData: () => Promise<void>;
     clearCache: () => Promise<void>;
     forceRefresh: () => Promise<void>;
     isDataStale: boolean;
}

export const useJourneyData = (): UseJourneyDataReturn => {
     const { isAuthenticated: checkAuth } = useAuth();

     const [state, setState] = useState<JourneyDataState>({
          overview: null,
          stages: [],
          loading: true,
          error: null,
          lastUpdated: null,
          isAuthenticated: false,
     });

     // ✅ NEW: Track current journey ID to detect changes
     const [currentJourneyId, setCurrentJourneyId] = useState<string | null>(null);

     // Check authentication status
     const checkAuthenticationStatus = useCallback(async () => {
          try {
               const authStatus = await checkAuth();
               setState(prev => ({ ...prev, isAuthenticated: authStatus }));
               return authStatus;
          } catch (error) {
               console.error('Error checking authentication:', error);
               setState(prev => ({ ...prev, isAuthenticated: false }));
               return false;
          }
     }, [checkAuth]);

     // Check if cached data is stale
     const isDataStale = useCallback(() => {
          if (!state.lastUpdated) return true;
          const now = Date.now();
          const timeDiff = now - state.lastUpdated;
          return timeDiff > APP_CONSTANTS.CACHE_EXPIRATION.JOURNEY_DATA;
     }, [state.lastUpdated]);

     // Load cached data from AsyncStorage
     const loadCachedData = useCallback(async () => {
          try {
               const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.JOURNEY_CACHE);
               if (cachedData) {
                    const parsed = JSON.parse(cachedData);
                    setState(prev => ({
                         ...prev,
                         overview: parsed.overview,
                         stages: parsed.stages,
                         lastUpdated: parsed.lastUpdated,
                    }));
                    return true;
               }
          } catch (error) {
               console.error('Error loading cached journey data:', error);
          }
          return false;
     }, []);

     // Save data to cache
     const saveToCache = useCallback(async (overview: JourneyNewOverview, stages: JourneyNewStage[]) => {
          try {
               const cacheData = {
                    overview,
                    stages,
                    lastUpdated: Date.now(),
               };
               await AsyncStorage.setItem(STORAGE_KEYS.JOURNEY_CACHE, JSON.stringify(cacheData));
          } catch (error) {
               console.error('Error saving journey data to cache:', error);
          }
     }, []);

     // Clear cache
     const clearCache = useCallback(async () => {
          try {
               await AsyncStorage.removeItem(STORAGE_KEYS.JOURNEY_CACHE);
               setState(prev => ({
                    ...prev,
                    overview: null,
                    stages: [],
                    lastUpdated: null,
               }));
          } catch (error) {
               console.error('Error clearing journey cache:', error);
          }
     }, []);

     // ✅ NEW: Detect journey change and clear cache if needed
     const checkJourneyChange = useCallback(async (newOverview: JourneyNewOverview) => {
          if (currentJourneyId && currentJourneyId !== newOverview.id) {
               console.log('🔄 Journey changed detected, clearing cache:', {
                    oldJourneyId: currentJourneyId,
                    newJourneyId: newOverview.id
               });
               await clearCache();
          }
          setCurrentJourneyId(newOverview.id);
     }, [currentJourneyId, clearCache]);

     // ✅ PERFORMANCE FIX: Fetch data with lazy loading strategy
     const fetchFreshData = useCallback(async (lazyLoadStages = true) => {
          try {
               // ✅ FIXED: Check authentication before making API calls
               const authStatus = await checkAuthenticationStatus();
               if (!authStatus) {
                    console.log('🚫 User not authenticated, skipping data fetch');
                    setState(prev => ({
                         ...prev,
                         loading: false,
                         error: 'Vui lòng đăng nhập để tiếp tục',
                         isAuthenticated: false,
                    }));
                    return;
               }

               setState(prev => ({ ...prev, loading: true, error: null }));

               // ✅ PERFORMANCE: Load overview first (faster)
               console.log('🚀 Loading journey overview...');
               const overview = await JourneyNewService.getJourneyOverview(!lazyLoadStages);

               // ✅ NEW: Check for journey change before proceeding
               await checkJourneyChange(overview);

               // Update state with overview first for immediate UI update
               setState(prev => ({
                    ...prev,
                    overview,
                    loading: false,
                    error: null,
                    lastUpdated: Date.now(),
                    isAuthenticated: true,
               }));

               // ✅ FIXED: Load stages immediately to avoid infinite loop
               if (process.env.NODE_ENV === 'development' && Math.random() < 0.1) {
                    console.log('🚀 Loading stages...');
               }
               const stages = await JourneyNewService.getJourneyStages(!lazyLoadStages);

               setState(prev => ({
                    ...prev,
                    stages,
                    lastUpdated: Date.now(),
               }));

               // Save complete data to cache
               await saveToCache(overview, stages);

               return { overview, stages };
          } catch (error: any) {
               console.error('Error fetching journey data:', error);

               // ✅ IMPROVED: Better error handling for auth errors
               let errorMessage = 'Không thể tải dữ liệu journey';
               if (error.message?.includes('401') || error.message?.includes('Authentication')) {
                    errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
                    setState(prev => ({ ...prev, isAuthenticated: false }));
               }

               setState(prev => ({
                    ...prev,
                    loading: false,
                    error: errorMessage,
               }));
               throw error;
          }
     }, [saveToCache, checkJourneyChange, checkAuthenticationStatus]);

     // Refresh data (force fetch from API with lazy loading)
     const refreshData = useCallback(async () => {
          await fetchFreshData(true); // Use lazy loading for better performance
     }, [fetchFreshData]);

     // ✅ NEW: Force refresh (clear cache + fetch fresh data immediately)
     const forceRefresh = useCallback(async () => {
          console.log('🔄 Force refreshing journey data...');
          await clearCache();
          await fetchFreshData(false); // Load all data immediately for force refresh
     }, [clearCache, fetchFreshData]);

     // ✅ FIXED: Load data on mount only once
     useEffect(() => {
          const loadData = async () => {
               // ✅ FIXED: Check authentication first
               const authStatus = await checkAuthenticationStatus();

               if (!authStatus) {
                    console.log('🚫 User not authenticated, showing login prompt');
                    setState(prev => ({
                         ...prev,
                         loading: false,
                         error: 'Vui lòng đăng nhập để tiếp tục',
                         isAuthenticated: false,
                    }));
                    return;
               }

               // First, try to load cached data
               const hasCachedData = await loadCachedData();

               if (hasCachedData && !isDataStale()) {
                    // Use cached data if it's fresh
                    setState(prev => ({ ...prev, loading: false, isAuthenticated: true }));
               } else {
                    // Fetch fresh data if no cache or data is stale
                    try {
                         await fetchFreshData();
                    } catch (error) {
                         // If API fails and we have cached data, use it
                         if (hasCachedData) {
                              setState(prev => ({ ...prev, loading: false, isAuthenticated: true }));
                         }
                    }
               }
          };

          loadData();
          // ✅ FIXED: Empty dependency array to run only on mount
     }, []);

     return {
          ...state,
          refreshData,
          clearCache,
          forceRefresh,
          isDataStale: isDataStale(),
     };
};

export default useJourneyData; 