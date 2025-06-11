# 🔧 JOURNEY CACHE REFRESH FIX APPLIED

**Ngày:** 2025-01-26  
**Lỗi gốc:** Đổi lộ trình mới nhưng Journey overview vẫn hiển thị target score cũ  
**Nguyên nhân:** Cache data không được refresh khi có journey mới  
**Trạng thái:** ✅ ĐÃ PHÁT HIỆN VÀ ĐỀ XUẤT FIX

---

## 🚨 VẤN ĐỀ ĐÃ PHÁT HIỆN

### Journey Cache Không Được Refresh
- **Hiện tượng:** Đổi từ journey 300 điểm → 650 điểm TOEIC
- **Kết quả:** Journey overview vẫn hiển thị "Mục tiêu: 300 điểm TOEIC"
- **Mong đợi:** Hiển thị "Mục tiêu: 650 điểm TOEIC"

### Cache Behavior Analysis:
- **Hook:** `useJourneyData.ts` có cache mechanism với `AsyncStorage`
- **Cache Key:** `STORAGE_KEYS.JOURNEY_CACHE`
- **Cache Expiration:** `APP_CONSTANTS.CACHE_EXPIRATION.JOURNEY_DATA`
- **Problem:** Cache không được invalidated khi user switches journey

---

## 🔍 NGUYÊN NHÂN GỐC RỬ

### 1. Cache Logic Issue
**File:** `hooks/useJourneyData.ts`

**Current flow:**
1. App loads → Check cached data
2. If cache fresh → Use cached data (OLD JOURNEY)
3. If cache stale → Fetch new data

**Problem:** 
- Khi user switches journey, cache vẫn valid nhưng chứa data của journey cũ
- Không có mechanism để detect journey change và invalidate cache

### 2. Journey ID Không Được Track
- Cache key chỉ là `JOURNEY_CACHE` (generic)
- Không include journey ID trong cache key
- Multiple journeys share same cache slot

### 3. API Endpoint Analysis
- `GET /api/journeys/current` returns current user's active journey
- Khi backend change active journey → API returns new data
- Nhưng frontend cache che dấu API response mới

---

## ✅ GIẢI PHÁP ĐỀ XUẤT

### Solution 1: Force Refresh After Journey Switch
**Update useJourneyData với journey change detection:**

```javascript
// ✅ NEW: Add journey ID tracking
const [currentJourneyId, setCurrentJourneyId] = useState<string | null>(null);

// ✅ NEW: Detect journey change and clear cache
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
```

### Solution 2: Journey-Specific Cache Keys
**Update cache keys để include journey ID:**

```javascript
// ✅ NEW: Journey-specific cache key
const getJourneyCacheKey = (journeyId: string) => `${STORAGE_KEYS.JOURNEY_CACHE}_${journeyId}`;

// Update save/load methods to use journey-specific keys
const saveToCache = useCallback(async (overview: JourneyNewOverview, stages: JourneyNewStage[]) => {
     try {
          const cacheKey = getJourneyCacheKey(overview.id);
          const cacheData = { overview, stages, lastUpdated: Date.now() };
          await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
     } catch (error) {
          console.error('Error saving journey data to cache:', error);
     }
}, []);
```

### Solution 3: Manual Cache Clear Function
**Add manual cache clear trigger:**

```javascript
// ✅ NEW: Add force refresh option
const forceRefresh = useCallback(async () => {
     console.log('🔄 Force refreshing journey data...');
     await clearCache();
     await fetchFreshData();
}, [clearCache, fetchFreshData]);

// Export forceRefresh for manual triggering
return {
     ...state,
     refreshData,
     clearCache,
     forceRefresh, // ✅ NEW
     isDataStale: isDataStale(),
};
```

---

## 🛠️ IMMEDIATE WORKAROUND

### Quick Fix for Testing:
**Clear cache manually khi test:**

```javascript
// In browser/debugger console hoặc add button in UI:
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clear journey cache
AsyncStorage.removeItem('journeyNewCache').then(() => {
     console.log('Journey cache cleared');
     // Then pull-to-refresh hoặc restart app
});
```

### Add Debug Button (Temporary):
**Thêm button trong UI để clear cache:**

```javascript
// In JourneyOverview component
<TouchableOpacity 
     onPress={async () => {
          await clearCache();
          await refreshData();
          console.log('Cache cleared and data refreshed');
     }}
     style={{ padding: 10, backgroundColor: 'red', margin: 10 }}
>
     <Text style={{ color: 'white' }}>🔄 Clear Cache & Refresh</Text>
</TouchableOpacity>
```

---

## 🧪 TESTING SCENARIOS

### Test Case 1: Journey Switch Detection
1. Start với journey 300 điểm TOEIC
2. Note journey ID trong console logs
3. Switch to journey 650 điểm TOEIC (via backend/admin)
4. Pull-to-refresh in app
5. **Expected:** New journey data loads, target score = 650

### Test Case 2: Cache Invalidation
1. Check `AsyncStorage` cho journey cache
2. Switch journey in backend
3. Force refresh app data
4. **Expected:** Cache cleared, new journey data loaded

### Test Case 3: Multiple Journeys
1. User has multiple journeys available
2. Switch between journeys
3. **Expected:** Each journey shows correct target score

---

## 🔍 DEBUG INSTRUCTIONS

### Check Current Cache:
```javascript
// In React Native debugger console:
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getItem('journeyNewCache').then(data => {
     if (data) {
          const parsed = JSON.parse(data);
          console.log('Cached Journey Data:', {
               journeyId: parsed.overview?.id,
               title: parsed.overview?.title,
               description: parsed.overview?.description,
               targetScore: parsed.overview?.stages?.[parsed.overview.stages.length - 1]?.targetScore,
               lastUpdated: new Date(parsed.lastUpdated).toLocaleString()
          });
     } else {
          console.log('No cached journey data');
     }
});
```

### Monitor API Calls:
```javascript
// Look for these logs trong console:
🔍 Journey Progress Debug: {
  finalTargetScore: 650, // Should match new journey
  journeyStatus: "IN_PROGRESS",
  // ...
}

🎯 Journey Title Debug: {
  finalTargetScore: 650, // Should match new journey  
  generatedTitle: "Lộ trình hiện tại của bạn",
  generatedDescription: "Mục tiêu: 650 điểm TOEIC"
}
```

---

## 📋 IMPLEMENTATION STEPS

### Immediate Actions:
1. **Manual cache clear** để test ngay
2. **Monitor console logs** để verify API returns correct data
3. **Add debug logging** cho journey ID tracking

### Short-term Fix:
1. **Implement journey change detection** trong useJourneyData
2. **Add force refresh mechanism** 
3. **Update cache keys** để journey-specific

### Long-term Solution:
1. **Real-time journey switching** support
2. **Better cache invalidation** strategies
3. **Journey state management** improvements

---

## 🎯 EXPECTED RESULTS AFTER FIX

### Journey Switch Flow:
1. User switches journey 300 → 650 điểm
2. App detects journey ID change
3. Cache automatically cleared
4. Fresh data fetched from API
5. UI shows "Mục tiêu: 650 điểm TOEIC"

### Console Logs:
```
🔄 Journey changed detected, clearing cache: {
  oldJourneyId: "journey_300_toeic",
  newJourneyId: "journey_650_toeic"
}

🎯 Journey Title Debug: {
  status: "IN_PROGRESS",
  finalTargetScore: 650,
  generatedTitle: "Lộ trình hiện tại của bạn", 
  generatedDescription: "Mục tiêu: 650 điểm TOEIC"
}
```

---

## 🚨 URGENT ACTION REQUIRED

**Status**: 🔴 **DATA CONSISTENCY ISSUE**

**Impact**: 
- User confusion (wrong target score displayed)
- Data integrity concerns
- Poor user experience khi switching journeys

**Quick Fix Available**: ✅ Manual cache clear
**Permanent Fix Needed**: ✅ Journey change detection + cache invalidation

**Recommended Immediate Action**:
1. Test manual cache clear to verify fix works
2. Monitor API responses để confirm backend sends correct data  
3. Implement journey change detection trong next iteration

**Time Estimate**: 2 giờ cho complete fix implementation 