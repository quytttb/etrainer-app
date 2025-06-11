# Journey New - Báo Cáo Phân Tích & Thiết Kế

## 📋 Tổng Quan

**Mục tiêu:** Tạo Journey mới để thay thế Journey hiện tại đang gặp lỗi, tập trung vào tính ổn định, UX tốt và performance.

**Nguyên tắc:** Keep it Simple, Focus on Core Features, Build MVP First

---

## 🗄️ Phân Tích Database

### Thống Kê Database Hiện Tại
- **Users:** 9 người dùng
- **UserJourneys:** 18 journey (lộ trình học)  
- **Stages:** 4 giai đoạn
- **Questions:** 30 câu hỏi
- **Exams:** 4 bài thi
- **PracticeHistories:** 87 lần luyện tập

### Cấu Trúc Database Chính

#### 1. Bảng `userjourneys`
```javascript
{
  _id: ObjectId,
  user: ObjectId,                    // FK → users._id
  stages: [                          // Array các giai đoạn
    {
      stageId: ObjectId,             // FK → stages._id
      minScore: Number,              // Điểm tối thiểu
      targetScore: Number,           // Điểm mục tiêu
      days: [                        // Array các ngày học
        {
          dayNumber: Number,         // Ngày thứ mấy
          started: Boolean,          // Đã bắt đầu chưa
          completed: Boolean,        // Đã hoàn thành chưa
          startedAt: Date,          // Thời gian bắt đầu
          questions: [ObjectId]      // FK → questions._id
        }
      ],
      finalTest: {                   // Bài test cuối giai đoạn
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
      state: String,                // "NOT_STARTED", "IN_PROGRESS", "COMPLETED", "SKIPPED"
      completedAt: Date
    }
  ],
  currentStageIndex: Number,         // Giai đoạn hiện tại
  state: String,                     // Trạng thái tổng thể
  startedAt: Date,
  completedAt: Date
}
```

#### 2. Bảng `stages`
```javascript
{
  _id: ObjectId,
  minScore: Number,                  // Điểm đầu vào
  targetScore: Number,               // Điểm mục tiêu
  days: [                           // Template các ngày học
    {
      dayNumber: Number,
      questions: [ObjectId],         // FK → questions._id
      exam: ObjectId                 // FK → exams._id
    }
  ]
}
```

#### 3. Bảng `questions`
```javascript
{
  _id: ObjectId,
  questionNumber: Number,            // Số thứ tự (unique)
  type: String,                      // Loại câu hỏi
  question: String,                  // Nội dung
  audio: {name: String, url: String}, // File âm thanh
  imageUrl: String,                 // Hình ảnh
  answers: [...],                   // Các đáp án
  questions: [...],                 // Câu hỏi con (conversation/reading)
  subtitle: String,                 // Phụ đề
  explanation: String               // Giải thích
}
```

### Các Loại Câu Hỏi (LESSON_TYPE)
- `IMAGE_DESCRIPTION` - Mô tả hình ảnh
- `ASK_AND_ANSWER` - Hỏi và đáp  
- `CONVERSATION_PIECE` - Đoạn hội thoại
- `SHORT_TALK` - Bài nói chuyện ngắn
- `FILL_IN_THE_BLANK_QUESTION` - Điền vào câu
- `FILL_IN_THE_PARAGRAPH` - Điền vào đoạn văn
- `READ_AND_UNDERSTAND` - Đọc hiểu đoạn văn
- `STAGE_FINAL_TEST` - Bài test tổng kết giai đoạn

---

## 🏗️ Cấu Trúc Journey Mới

### Navigation Flow
```
Tab: Journey Mới
    ↓
Journey Overview (Landing)
    ↓
[Select Journey] → Journey Details
    ↓
[Select Stage] → Stage Overview
    ↓
[Daily Lessons] → Lesson Content → Results
[Practice Tests] → Test Interface → Results  
[Final Exam] → Exam Interface → Results
    ↓
Basic Analytics & Next Steps
```

### Kiến Trúc Thư Mục
```
journeyNew/
├── index.tsx                    # Main Journey Landing
├── components/
│   ├── JourneyOverview/
│   │   ├── index.tsx           # Tổng quan Journey
│   │   ├── JourneyCard.tsx     # Card hiển thị journey
│   │   ├── ProgressBar.tsx     # Progress visualization  
│   │   └── StageList.tsx       # Danh sách stages
│   │
│   ├── StageDetail/
│   │   ├── index.tsx           # Chi tiết stage
│   │   ├── StageHeader.tsx     # Header thông tin stage
│   │   ├── DayCard.tsx         # Card từng ngày học
│   │   ├── LessonList.tsx      # Danh sách bài học
│   │   └── TestSection.tsx     # Phần bài test
│   │
│   ├── LessonContent/
│   │   ├── index.tsx           # Nội dung bài học
│   │   ├── QuestionRenderer.tsx # Render câu hỏi
│   │   ├── AudioPlayer.tsx     # Player âm thanh (cơ bản)
│   │   ├── ImageViewer.tsx     # Hiển thị hình ảnh
│   │   └── AnswerInput.tsx     # Input đáp án
│   │
│   ├── TestInterface/
│   │   ├── index.tsx           # Giao diện làm test
│   │   ├── TestTimer.tsx       # Đếm thời gian
│   │   ├── QuestionNavigation.tsx # Điều hướng câu hỏi
│   │   └── SubmitConfirm.tsx   # Xác nhận nộp bài
│   │
│   ├── Results/
│   │   ├── index.tsx           # Kết quả
│   │   ├── ScoreDisplay.tsx    # Hiển thị điểm
│   │   ├── ReviewSection.tsx   # Xem lại câu hỏi
│   │   └── NextSteps.tsx       # Bước tiếp theo
│   │
│   └── Common/
│       ├── LoadingSpinner.tsx  # Loading states
│       ├── ErrorMessage.tsx    # Error handling
│       └── ConfirmModal.tsx    # Modal xác nhận
│
├── screens/
│   ├── JourneyOverview.tsx     # Screen tổng quan
│   ├── StageDetails.tsx        # Screen chi tiết stage  
│   ├── LessonScreen.tsx        # Screen bài học
│   ├── TestScreen.tsx          # Screen làm test
│   ├── ExamScreen.tsx          # Screen thi cuối kỳ
│   └── ResultsScreen.tsx       # Screen kết quả
│
├── hooks/
│   ├── useJourneyData.tsx      # Hook quản lý data journey
│   ├── useProgress.tsx         # Hook tracking progress
│   ├── useTimer.tsx            # Hook đếm thời gian
│   └── useAudio.tsx            # Hook xử lý âm thanh
│
├── context/
│   ├── JourneyContext.tsx      # Context journey state
│   └── ProgressContext.tsx     # Context tiến độ
│
├── utils/
│   ├── scoreCalculator.ts      # Tính toán điểm
│   ├── progressTracker.ts      # Theo dõi tiến độ
│   └── dataTransformer.ts      # Transform data
│
├── types.ts                    # Type definitions
├── service.ts                  # API services
└── JOURNEY_NEW_ANALYSIS.md     # File báo cáo này
```

---

## 🎯 Core Features (MVP)

### 1. Journey Overview Screen
- **Hero Section:** Progress overview đơn giản
- **Journey List:** Danh sách journeys available
- **Current Journey:** Journey đang học với progress
- **Quick Stats:** Số câu đã làm, accuracy cơ bản

### 2. Stage Detail Screen
- **Stage Info:** Thông tin stage với progress bar
- **Daily Schedule:** Danh sách ngày học
- **Lesson Preview:** Preview nội dung cơ bản
- **Test Section:** Practice tests và final exam
- **Navigation:** Clear next/previous buttons

### 3. Lesson Interface
- **Question Display:** Hiển thị câu hỏi rõ ràng
- **Audio Player:** Basic controls (play/pause/seek)
- **Image Display:** Simple image viewer
- **Answer Input:** Form validation cơ bản
- **Progress Indicator:** Câu hiện tại / tổng số câu

### 4. Test Interface
- **Timer:** Đếm ngược thời gian
- **Question Navigation:** Previous/Next, jump to question
- **Answer Sheet:** Overview tất cả câu hỏi
- **Submit:** Confirmation modal trước khi nộp

### 5. Results Screen
- **Score Display:** Điểm số rõ ràng
- **Breakdown:** Correct/Incorrect by question type
- **Review:** Xem lại từng câu hỏi
- **Next Steps:** Continue/Retry/Next Stage

---

## 🎨 UI/UX Improvements

### Design Principles
- **Clean & Simple:** Không cluttered, focus vào content
- **Consistent:** Unified color scheme, typography
- **Accessible:** Good contrast, readable fonts
- **Responsive:** Works well on different screen sizes
- **Fast:** Smooth transitions, no lag

### Key UI Elements
- **Progress Bars:** Visual progress indication
- **Card Layout:** Clean separation of content
- **Button States:** Clear enabled/disabled/loading states
- **Typography:** Hierarchy rõ ràng (headings, body, captions)
- **Color Coding:** Success/Error/Warning/Info states

---

## 🔧 Technical Implementation

### Performance Optimizations
- **Lazy Loading:** Load screens theo demand
- **Data Caching:** Cache với React Query
- **Image Optimization:** Optimize loading
- **Memory Management:** Cleanup resources properly

### State Management
- **Context API:** Cho global state đơn giản
- **Local State:** useState cho component-specific state
- **Persistent Storage:** AsyncStorage cho offline data
- **Error Handling:** Try-catch, Error Boundaries

### API Integration
- **Reuse Existing APIs:** Tương thích với backend hiện tại
- **Error Handling:** Proper error messages
- **Loading States:** Loading indicators
- **Retry Logic:** Auto retry failed requests

---

## 📱 Development Phases

### Phase 1: Foundation (Week 1-2)
1. ✅ Setup thư mục và cấu trúc
2. ⏳ Journey Overview Screen
3. ⏳ Basic navigation setup
4. ⏳ Context providers

### Phase 2: Core Screens (Week 3-4)  
1. ⏳ Stage Detail Screen
2. ⏳ Lesson Interface  
3. ⏳ Test Interface
4. ⏳ Results Screen

### Phase 3: Polish & Testing (Week 5-6)
1. ⏳ Error handling
2. ⏳ Performance optimization
3. ⏳ User testing & feedback
4. ⏳ Bug fixes

### Phase 4: Deployment (Week 7)
1. ⏳ Final testing
2. ⏳ Documentation
3. ⏳ Deployment to production

---

## ✅ Success Criteria

### Functional Requirements
- [ ] Users có thể xem tổng quan journey
- [ ] Users có thể navigate giữa stages
- [ ] Users có thể làm lessons và tests
- [ ] Users có thể xem results và progress
- [ ] Data sync chính xác với backend

### Non-Functional Requirements
- [ ] Loading time < 3 seconds
- [ ] Smooth animations (60fps)
- [ ] No crashes hoặc frozen screens
- [ ] Works offline (basic functionality)
- [ ] Responsive design

### User Experience
- [ ] Intuitive navigation
- [ ] Clear progress indication
- [ ] Helpful error messages
- [ ] Consistent UI patterns
- [ ] Accessible for all users

---

## 🚀 Next Steps

1. **Implement Journey Overview Screen** - Landing page với tổng quan
2. **Setup Navigation Structure** - React Navigation setup
3. **Create Base Components** - Common components
4. **Integrate with Existing API** - Reuse current endpoints
5. **Add Error Handling** - Robust error management

---

*Báo cáo được tạo ngày: $(date)*
*Phiên bản: 1.0*
*Trạng thái: Planning Phase* 