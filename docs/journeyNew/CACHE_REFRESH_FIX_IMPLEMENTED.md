# 🔧 JOURNEY CACHE REFRESH FIX IMPLEMENTED

**Ngày:** 2025-01-26  
**Vấn đề:** Journey overview vẫn hiển thị target score cũ khi đổi journey  
**Trạng thái:** ✅ **ĐÃ IMPLEMENT FIX**

---

## ✅ CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### 1. Journey Change Detection
**File:** `hooks/useJourneyData.ts`

**Added journey ID tracking:**
```javascript
// ✅ NEW: Track current journey ID to detect changes
const [currentJourneyId, setCurrentJourneyId] = useState<string | null>(null);

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
```

### 2. Force Refresh Function
**Added manual cache clear + fresh data fetch:**
```javascript
// ✅ NEW: Force refresh (clear cache + fetch fresh data)
const forceRefresh = useCallback(async () => {
     console.log('🔄 Force refreshing journey data...');
     await clearCache();
     await fetchFreshData();
}, [clearCache, fetchFreshData]);

// Export forceRefresh for manual triggering
interface UseJourneyDataReturn extends JourneyDataState {
     refreshData: () => Promise<void>;
     clearCache: () => Promise<void>;
     forceRefresh: () => Promise<void>; // ✅ NEW
     isDataStale: boolean;
}
```

### 3. Enhanced Debug Logging
**File:** `service.ts`

**Added comprehensive logging:**
```javascript
// ✅ DEBUG: Enhanced journey title generation logging
console.log('🎯 Journey Title Debug:', {
     journeyId: response._id,
     status: journeyStatus,
     finalTargetScore: response.stages[response.stages.length - 1]?.targetScore,
     allStageTargets: response.stages.map((s: any) => s.targetScore),
     generatedTitle: journeyTitle,
     generatedDescription: journeyDescription
});

// ✅ DEBUG: Full journey data for troubleshooting
console.log('📊 Full Journey Data:', {
     journeyId: response._id,
     currentStageIndex: response.currentStageIndex,
     totalStages: response.stages.length,
     stages: response.stages.map((s: any, idx: number) => ({
          index: idx,
          stageId: s.stageId,
          targetScore: s.targetScore,
          minScore: s.minScore,
          state: s.state,
          daysTotal: s.days?.length || 0,
          daysCompleted: s.days?.filter((d: any) => d.completed).length || 0
     }))
});
```

### 4. Integrated Journey Change Detection
**Updated fetchFreshData to check for journey changes:**
```javascript
const fetchFreshData = useCallback(async () => {
     try {
          // ... fetch data ...
          
          // ✅ NEW: Check for journey change before proceeding
          await checkJourneyChange(overview);
          
          // ... update state and cache ...
     } catch (error) {
          // ... error handling ...
     }
}, [saveToCache, checkJourneyChange]);
```

---

## 🎯 EXPECTED BEHAVIOR AFTER FIX

### Journey Switch Flow:
1. **User starts với journey 300 điểm TOEIC**
   - Cache: journey ID = "journey_300"
   - Display: "Mục tiêu: 300 điểm TOEIC"

2. **Backend switches user to journey 650 điểm TOEIC**
   - Next API call returns journey ID = "journey_650"

3. **App detects journey change:**
   ```
   🔄 Journey changed detected, clearing cache: {
     oldJourneyId: "journey_300",
     newJourneyId: "journey_650"
   }
   ```

4. **Cache cleared + fresh data loaded:**
   - Display: "Mục tiêu: 650 điểm TOEIC"

### Console Logs to Monitor:
```
🎯 Journey Title Debug: {
  journeyId: "journey_650",
  status: "IN_PROGRESS",
  finalTargetScore: 650,
  allStageTargets: [0, 300, 650],
  generatedTitle: "Lộ trình hiện tại của bạn",
  generatedDescription: "Mục tiêu: 650 điểm TOEIC"
}

📊 Full Journey Data: {
  journeyId: "journey_650",
  stages: [
    { index: 0, targetScore: 0, state: "COMPLETED" },
    { index: 1, targetScore: 300, state: "COMPLETED" },
    { index: 2, targetScore: 650, state: "IN_PROGRESS" }
  ]
}
```

---

## 🧪 TESTING INSTRUCTIONS

### Manual Testing Steps:

1. **Check Current Cache:**
   ```javascript
   // In React Native debugger console:
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   AsyncStorage.getItem('journeyNewCache').then(data => {
        const parsed = JSON.parse(data);
        console.log('Current cached journey ID:', parsed.overview?.id);
   });
   ```

2. **Force Refresh Test:**
   - Pull-to-refresh trong app
   - Monitor console logs cho journey change detection
   - Verify target score updates

3. **Manual Force Refresh:**
   ```javascript
   // Call forceRefresh function in component
   const { forceRefresh } = useJourneyData();
   
   // In button handler:
   await forceRefresh();
   ```

### Debug Button (Temporary):
**Add to JourneyOverview component for testing:**
```javascript
import { useJourneyData } from '../hooks/useJourneyData';

const JourneyOverview = ({ ... }) => {
     const { forceRefresh, clearCache } = useJourneyData();
     
     return (
          <View>
               {/* ... existing UI ... */}
               
               {/* ✅ DEBUG: Temporary testing buttons */}
               <View style={{ flexDirection: 'row', padding: 10 }}>
                    <TouchableOpacity 
                         onPress={forceRefresh}
                         style={{ backgroundColor: 'blue', padding: 10, margin: 5 }}
                    >
                         <Text style={{ color: 'white' }}>🔄 Force Refresh</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                         onPress={clearCache}
                         style={{ backgroundColor: 'red', padding: 10, margin: 5 }}
                    >
                         <Text style={{ color: 'white' }}>🗑️ Clear Cache</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};
```

---

## 🔍 TROUBLESHOOTING GUIDE

### If Target Score Still Wrong:

1. **Check API Response:**
   - Monitor `📊 Full Journey Data` logs
   - Verify `finalTargetScore` value
   - Confirm `journeyId` has changed

2. **Check Cache Behavior:**
   - Monitor `🔄 Journey changed detected` logs
   - If no detection logs → journey ID might be same
   - If detection logs appear → cache should clear

3. **Manual Interventions:**
   ```javascript
   // Clear cache manually
   AsyncStorage.removeItem('journeyNewCache');
   
   // Force refresh data
   await forceRefresh();
   
   // Restart app completely
   ```

### If Journey ID Not Changing:
- Backend may not have switched active journey
- Check `/api/journeys/current` response directly
- Verify user has multiple journeys available
- Confirm backend journey switching logic

---

## 📋 VALIDATION CHECKLIST

### Pre-Testing:
- [ ] Force refresh function exports correctly
- [ ] Journey change detection compiles without errors
- [ ] Debug logging implemented
- [ ] TypeScript interfaces updated

### During Testing:
- [ ] Monitor console logs for journey detection
- [ ] Verify cache clear messages appear
- [ ] Check target score updates in UI
- [ ] Test pull-to-refresh functionality

### Post-Testing:
- [ ] Remove debug buttons from production
- [ ] Consider reducing debug log verbosity
- [ ] Document any remaining edge cases
- [ ] Update user documentation if needed

---

## 🎉 SUMMARY

**Status**: ✅ **JOURNEY CACHE REFRESH FIX IMPLEMENTED**

**Key Features Added:**
- Automatic journey change detection
- Cache invalidation on journey switch
- Force refresh functionality
- Comprehensive debug logging

**Expected Impact:**
- ✅ Journey target score updates immediately khi đổi journey
- ✅ No more stale cache data issues
- ✅ Better debugging capabilities
- ✅ Manual override options available

**Next Steps:**
1. Test với real journey switching scenario
2. Monitor console logs để validate fix
3. Remove debug UI elements sau khi testing
4. Consider permanent solution cho journey state management

**Ready for Testing**: ✅ **JOURNEY CACHE REFRESH READY FOR VALIDATION** 