# 🔍 ENDPOINT ANALYSIS REPORT

**Ngày phân tích:** 2025-01-26  
**Mục đích:** So sánh API Integration Guide vs Database Schema vs Actual Backend Endpoints  
**Kết quả:** Xác định gaps và đề xuất cập nhật

---

## 📋 TÓM TẮT PHÂN TÍCH

### 🎯 Nguồn thông tin đã phân tích:
1. ✅ **API Integration Guide** - Endpoints được định nghĩa trong frontend
2. ✅ **Database Journey Analysis Report** - Cấu trúc database thực tế
3. ✅ **Backend Source Code** - Endpoints thực tế trong etrainer-backend-main

---

## 🚨 PHÁT HIỆN QUAN TRỌNG

### ❌ ENDPOINTS KHÔNG KHỚP

| API Integration Guide | Backend Thực Tế | Status |
|----------------------|------------------|---------|
| `GET /api/user-journeys/{userId}` | `GET /api/journeys/current` | ❌ **KHÁC BIỆT** |
| `GET /api/stages` | `GET /api/stages/` | ✅ **KHỚP** |
| `GET /api/questions/{id}` | `GET /api/question/:id` | ⚠️ **GẦN KHỚP** |
| `POST /api/practice-histories` | `POST /api/practice/submit` | ❌ **KHÁC BIỆT** |
| `PUT /api/user-journeys/{userId}/stage/{stageId}/day/{dayId}` | `PUT /api/journeys/complete-day/:stageIndex/:dayNumber` | ❌ **KHÁC BIỆT** |

---

## 📡 BACKEND ENDPOINTS THỰC TẾ

### 🏠 User Journey Routes (`/api/journeys`)
```javascript
// Tạo journey mới
POST /api/journeys
Body: { stageIds: [ObjectId] }
Auth: Required

// Lấy current journey của user
GET /api/journeys/current  
Auth: Required
Response: {
  _id, user, stages[], currentStageIndex, 
  state, completionRate, completedDays, totalDays
}

// Hoàn thành một ngày
PUT /api/journeys/complete-day/:stageIndex/:dayNumber
Auth: Required

// Final Test routes
GET /api/journeys/stage-final-test/:stageIndex
POST /api/journeys/start-stage-final-test/:stageIndex
PUT /api/journeys/complete-stage-final-test/:stageIndex

// Skip stage
PUT /api/journeys/skip-stage/:stageIndex

// Debug routes (no auth)
GET /api/journeys/debug-user/:userId
GET /api/journeys/debug-finaltest/:userId
GET /api/journeys/test-final-test-status/:stageIndex
```

### 📚 Stage Routes (`/api/stages`)
```javascript
GET /api/stages/           // Get all stages
GET /api/stages/:id        // Get stage by ID
POST /api/stages/          // Create stage (Admin)
PUT /api/stages/:id        // Update stage (Admin)
DELETE /api/stages/:id     // Delete stage (Admin)
```

### ❓ Question Routes (`/api/question`)
```javascript
GET /api/question/         // Get all questions
GET /api/question/:id      // Get question by ID
POST /api/question/        // Create question
PUT /api/question/:id      // Update question
DELETE /api/question/:id   // Delete question
```

### 📊 Practice Routes (`/api/practice`)
```javascript
POST /api/practice/submit    // Submit practice result
POST /api/practice/start     // Start practice session
GET /api/practice/history    // Get user practice history
GET /api/practice/history/:id // Get specific practice history
GET /api/practice/admin/history // Admin view (Admin)
```

---

## 🗄️ DATABASE SCHEMA MAPPING

### UserJourney Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId → users._id,
  stages: [{
    stageId: ObjectId → stages._id,
    minScore: Number,
    targetScore: Number,
    days: [{
      dayNumber: Number,
      started: Boolean,
      completed: Boolean, 
      startedAt: Date,
      questions: [ObjectId] → questions._id
    }],
    finalTest: {
      unlocked: Boolean,
      started: Boolean,
      completed: Boolean,
      startedAt: Date,
      completedAt: Date,
      score: Number,
      passed: Boolean
    },
    started: Boolean,
    startedAt: Date,
    state: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED",
    completedAt: Date
  }],
  currentStageIndex: Number,
  state: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED",
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Question Types (LESSON_TYPE)
```javascript
{
  IMAGE_DESCRIPTION: "IMAGE_DESCRIPTION",
  ASK_AND_ANSWER: "ASK_AND_ANSWER", 
  CONVERSATION_PIECE: "CONVERSATION_PIECE",
  SHORT_TALK: "SHORT_TALK",
  FILL_IN_THE_BLANK_QUESTION: "FILL_IN_THE_BLANK_QUESTION",
  FILL_IN_THE_PARAGRAPH: "FILL_IN_THE_PARAGRAPH", 
  READ_AND_UNDERSTAND: "READ_AND_UNDERSTAND",
  STAGE_FINAL_TEST: "STAGE_FINAL_TEST"
}
```

---

## 🔧 CẦN CẬP NHẬT TRONG FRONTEND

### 1. Service.ts - API Endpoints
```typescript
// ❌ CŨ (trong API Integration Guide)
const API_ENDPOINTS = {
  JOURNEY_OVERVIEW: (userId: string) => `/user-journeys/${userId}`,
  STAGES: '/stages',
  QUESTIONS: (questionId: string) => `/questions/${questionId}`,
  PRACTICE_HISTORY: '/practice-histories',
  UPDATE_PROGRESS: (userId: string, stageId: string, dayId: string) => 
    `/user-journeys/${userId}/stage/${stageId}/day/${dayId}`
};

// ✅ MỚI (theo backend thực tế)
const API_ENDPOINTS = {
  JOURNEY_CURRENT: '/journeys/current',              // GET current journey
  STAGES: '/stages',                                 // GET all stages
  QUESTIONS: (questionId: string) => `/question/${questionId}`,
  PRACTICE_SUBMIT: '/practice/submit',               // POST submit practice
  PRACTICE_START: '/practice/start',                 // POST start practice
  PRACTICE_HISTORY: '/practice/history',             // GET practice history
  COMPLETE_DAY: (stageIndex: number, dayNumber: number) => 
    `/journeys/complete-day/${stageIndex}/${dayNumber}`, // PUT complete day
  STAGE_FINAL_TEST: (stageIndex: number) => 
    `/journeys/stage-final-test/${stageIndex}`,      // GET final test
  START_FINAL_TEST: (stageIndex: number) => 
    `/journeys/start-stage-final-test/${stageIndex}`, // POST start final test
  COMPLETE_FINAL_TEST: (stageIndex: number) => 
    `/journeys/complete-stage-final-test/${stageIndex}` // PUT complete final test
};
```

### 2. useJourneyData Hook - API Calls
```typescript
// Cập nhật function calls
const fetchJourneyOverview = async () => {
  // ❌ Cũ: const response = await JourneyNewService.getJourneyOverview();
  // ✅ Mới: const response = await fetch('/api/journeys/current');
  
  return response;
};
```

### 3. Type Definitions - Update theo schema thực tế
```typescript
// Thêm missing fields từ backend schema
interface JourneyNewStage {
  // ... existing fields
  finalTest: {
    unlocked: boolean;
    started: boolean; 
    completed: boolean;
    startedAt?: Date;
    completedAt?: Date;
    score?: number;
    passed: boolean;
  };
  state: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  // ... other fields
}

interface JourneyOverview {
  // ... existing fields  
  currentStageIndex: number;
  completionRate: number;
  completedDays: number;
  totalDays: number;
  // ... other fields
}
```

---

## 🚀 AUTHENTICATION & AUTHORIZATION

### Header Requirements
```javascript
// All protected routes require:
Headers: {
  'Authorization': 'Bearer <JWT_TOKEN>',
  'Content-Type': 'application/json'
}

// User ID được lấy từ JWT token, không cần pass qua URL
```

### Admin Routes
```javascript
// Requires isAdmin middleware:
POST /api/stages/
PUT /api/stages/:id  
DELETE /api/stages/:id
GET /api/practice/admin/history
```

---

## 🎯 FINAL TEST SYSTEM (NEW DISCOVERY)

### Workflow
1. **Complete All Days** → `finalTest.unlocked = true`
2. **Start Final Test** → `POST /journeys/start-stage-final-test/:stageIndex`
3. **Get Test Questions** → Server tự động tạo test từ tất cả questions trong stage
4. **Submit Results** → `PUT /journeys/complete-stage-final-test/:stageIndex`
5. **Pass/Fail Logic** → Nếu pass thì `stage.state = "COMPLETED"`

### Test Generation Logic
- Lấy **tất cả questions** từ tất cả days trong stage
- **Shuffle ngẫu nhiên** 
- **Duration**: `Math.max(allQuestions.length * 2, 30)` minutes
- **Format**: Giống exam structure

---

## 📋 ACTION ITEMS

### ⚡ Urgent (Cần fix ngay)
1. [ ] **Cập nhật API endpoints** trong `service.ts`
2. [ ] **Cập nhật authentication** headers  
3. [ ] **Fix API calls** trong `useJourneyData.ts`
4. [ ] **Update type definitions** theo schema thực tế

### 🔄 Medium Priority  
5. [ ] **Implement Final Test system** 
6. [ ] **Add skip stage functionality**
7. [ ] **Implement practice submit/start**
8. [ ] **Add debug routes** cho development

### 📚 Documentation
9. [ ] **Update API Integration Guide** với endpoints đúng
10. [ ] **Create Final Test documentation**
11. [ ] **Update type consolidation**

---

## 🔍 TESTING PLAN

### 1. API Endpoint Testing
```bash
# Test current journey
curl -H "Authorization: Bearer <token>" \
  GET http://localhost:3000/api/journeys/current

# Test complete day  
curl -H "Authorization: Bearer <token>" \
  -X PUT http://localhost:3000/api/journeys/complete-day/0/1

# Test get stages
curl -H "Authorization: Bearer <token>" \
  GET http://localhost:3000/api/stages
```

### 2. Frontend Integration Testing
- [ ] Test với real API endpoints
- [ ] Verify authentication flow
- [ ] Test error handling
- [ ] Test final test workflow

---

## 💡 RECOMMENDATIONS

### 1. Immediate Fix
**Priority 1**: Update `service.ts` with correct endpoints để Journey Overview có thể hoạt động.

### 2. Backend Documentation
Backend thiếu comprehensive API documentation. Recommend tạo Swagger/OpenAPI docs.

### 3. Error Handling
Backend có good error handling, frontend cần match với error response format.

### 4. Security
JWT authentication working correctly, nhưng cần implement token refresh logic.

---

## 🎉 CONCLUSION

**Phát hiện chính**: API Integration Guide **KHÔNG KHỚP** với backend thực tế. Cần update urgent để Journey Overview có thể test được.

**Next Steps**: 
1. Fix service.ts endpoints
2. Test Journey Overview với real API
3. Implement Final Test system
4. Complete full integration

**Status**: 🔧 **REQUIRES IMMEDIATE ATTENTION** 