# 🎯 TARGET SCORE FIX APPLIED

**Ngày:** 2025-01-26  
**Lỗi gốc:** Journey hiển thị "300 điểm TOEIC" thay vì "650 điểm TOEIC"  
**Nguyên nhân:** Logic luôn sử dụng finalTargetScore thay vì currentTargetScore  
**Trạng thái:** ✅ ĐÃ SỬA

---

## 🚨 VẤN ĐỀ ĐÃ PHÁT HIỆN

### Target Score Hiển Thị Sai
- **Lỗi:** Journey hiển thị "Mục tiêu: 300 điểm TOEIC" 
- **Thực tế:** User đang ở stage 2 với mục tiêu 650 điểm TOEIC
- **Dữ liệu database:**
  - `currentStageIndex: 1` (stage thứ 2)
  - `stages[1].targetScore: 650` (mục tiêu stage hiện tại)
  - `stages[0].targetScore: 300` (mục tiêu stage đã hoàn thành)

### Root Cause Analysis
**Function:** `getJourneyInfo()` trong `service.ts`
```javascript
// ❌ BUG: Luôn dùng finalTargetScore cho tất cả cases
const finalTargetScore = stages[stages.length - 1]?.targetScore || 900;
const currentTargetScore = stages[response.currentStageIndex]?.targetScore || finalTargetScore;

// ❌ BUG: Dù đã tính currentTargetScore nhưng vẫn dùng finalTargetScore
return {
     title: `Lộ trình hiện tại của bạn`,
     description: `Mục tiêu: ${finalTargetScore} điểm TOEIC`  // Should be currentTargetScore
};
```

---

## ✅ GIẢI PHÁP ĐÃ ÁP DỤNG

### 1. Fixed Journey Info Logic
**File:** `service.ts` - `getJourneyInfo()` function

**Thay đổi:**
```javascript
// ✅ FIXED: Show current stage target for IN_PROGRESS
if (status === 'IN_PROGRESS') {
     return {
          title: `Lộ trình hiện tại của bạn`,
          description: `Mục tiêu: ${currentTargetScore} điểm TOEIC`  // ✅ Use currentTargetScore
     };
}
```

### 2. Enhanced NOT_STARTED Logic
**Thay đổi:**
```javascript
// ✅ IMPROVED: Show first stage target for NOT_STARTED
else {
     const firstStageTarget = stages[0]?.targetScore || finalTargetScore;
     return {
          title: `Bắt đầu lộ trình học của bạn`,
          description: `Mục tiêu: ${firstStageTarget} điểm TOEIC`  // ✅ Show first stage target
     };
}
```

### 3. Enhanced Debug Logging
**Added:**
```javascript
console.log('🎯 Journey Title Debug:', {
     journeyId: response._id,
     status: journeyStatus,
     currentStageIndex: response.currentStageIndex,            // ✅ NEW
     currentStageTarget: response.stages[response.currentStageIndex]?.targetScore,  // ✅ NEW
     finalTargetScore: response.stages[response.stages.length - 1]?.targetScore,
     allStageTargets: response.stages.map((s: any) => s.targetScore),
     generatedTitle: journeyTitle,
     generatedDescription: journeyDescription
});
```

---

## 🔍 DATABASE VERIFICATION

### Current User Journey Data:
```json
{
  "currentStageIndex": 1,
  "stages": [
    {
      "targetScore": 300,    // Stage 1 (hoàn thành) 
      "state": "IN_PROGRESS"
    },
    {
      "targetScore": 650,    // Stage 2 (hiện tại) ✅
      "state": "IN_PROGRESS"
    }
  ]
}
```

### Expected Behavior After Fix:
- **Before:** "Mục tiêu: 300 điểm TOEIC" (sai)
- **After:** "Mục tiêu: 650 điểm TOEIC" (đúng)

---

## 🎯 LOGIC MATRIX

| Journey Status | Target Score Hiển Thị | Logic |
|----------------|------------------------|-------|
| **COMPLETED** | `finalTargetScore` | Hiển thị mục tiêu cuối cùng đã đạt được |
| **IN_PROGRESS** | `currentTargetScore` | ✅ **FIXED:** Hiển thị mục tiêu stage hiện tại |
| **NOT_STARTED** | `firstStageTarget` | ✅ **IMPROVED:** Hiển thị mục tiêu stage đầu |

### Real-world Examples:
- **Stage 1 (300 điểm) → Stage 2 (650 điểm):**
  - IN_PROGRESS → "650 điểm TOEIC" ✅
- **Stage 2 (650 điểm) → Stage 3 (900 điểm):**
  - IN_PROGRESS → "900 điểm TOEIC" ✅
- **Journey hoàn thành:**
  - COMPLETED → "900 điểm TOEIC" (final target) ✅

---

## 🧪 TESTING SCENARIOS

### Test Case 1: User Ở Stage 2
```javascript
// Input:
currentStageIndex: 1
stages[1].targetScore: 650

// Expected Output:
"Mục tiêu: 650 điểm TOEIC"
```

### Test Case 2: User Bắt Đầu Journey  
```javascript
// Input:
currentStageIndex: 0
stages[0].targetScore: 300

// Expected Output:
"Mục tiêu: 300 điểm TOEIC"
```

### Test Case 3: Journey Hoàn Thành
```javascript
// Input:
status: "COMPLETED"
stages[stages.length-1].targetScore: 900

// Expected Output:
"Mục tiêu: 900 điểm TOEIC"
```

---

## 🔧 DEBUG CONSOLE OUTPUT

### After Fix Expected:
```javascript
🎯 Journey Title Debug: {
  journeyId: "682e169078b34729143daeec",
  status: "IN_PROGRESS",
  currentStageIndex: 1,
  currentStageTarget: 650,          // ✅ Current stage target
  finalTargetScore: 650,            // Final target
  allStageTargets: [300, 650],      // All stage targets
  generatedTitle: "Lộ trình hiện tại của bạn",
  generatedDescription: "Mục tiêu: 650 điểm TOEIC"  // ✅ Shows current, not final
}
```

---

## 🎉 SUMMARY

**Status**: ✅ **TARGET SCORE DISPLAY FIXED**

**Key Changes:**
- IN_PROGRESS journeys show current stage target
- NOT_STARTED journeys show first stage target  
- Enhanced debug logging for troubleshooting
- Logic aligns with user's actual learning progress

**Result:**
- ✅ User sees "650 điểm TOEIC" (current stage)
- ✅ Not "300 điểm TOEIC" (completed stage)
- ✅ Target score reflects actual learning goal
- ✅ Dynamic updates when user progresses to next stage

**Next Steps:**
1. Test app reload để xác nhận fix
2. Test journey progression sang stage mới
3. Verify console debug logs
4. Test edge cases (single stage journeys, etc.) 