# 🚀 API Integration Guide - Journey New

## 📋 Tổng quan

Journey New đã được tích hợp với API thật để lấy dữ liệu từ MongoDB database. Hướng dẫn này sẽ giúp bạn setup và sử dụng các tính năng API.

## 🔧 Setup & Configuration

### 1. Cấu hình API Base URL

Cập nhật URL backend trong file `utils/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-url.com/api', // Thay đổi URL này
  // ...
};
```

### 2. Cấu hình Authentication

Đảm bảo app đã lưu trữ token và user ID trong AsyncStorage:

```typescript
// Lưu token sau khi login
await AsyncStorage.setItem('accessToken', 'your-jwt-token');
await AsyncStorage.setItem('userId', 'user-object-id');
```

### 3. Database Schema Requirements

API yêu cầu database có các collections sau:

- `users` - Thông tin người dùng
- `userjourneys` - Journey của từng user
- `stages` - Template các giai đoạn
- `questions` - Câu hỏi và bài tập
- `practicehistories` - Lịch sử luyện tập

## 📡 API Endpoints

### Journey Overview
```
GET /api/user-journeys/{userId}
```
Trả về thông tin journey tổng quan của user.

### Stages Data
```
GET /api/stages
```
Trả về danh sách template các giai đoạn.

### Questions
```
GET /api/questions/{questionId}
```
Trả về chi tiết câu hỏi theo ID.

### Practice History
```
POST /api/practice-histories
```
Lưu lịch sử luyện tập của user.

### Update Progress
```
PUT /api/user-journeys/{userId}/stage/{stageId}/day/{dayId}
```
Cập nhật tiến độ học của user.

## 🏗️ Architecture

### Service Layer (`service.ts`)
- Quản lý tất cả API calls
- Xử lý authentication headers
- Error handling và retry logic

### Custom Hook (`useJourneyData.ts`)
- Quản lý state của journey data
- Caching với AsyncStorage
- Auto-refresh khi data stale

### Components
- `JourneyOverview` - Hiển thị tổng quan journey
- `StageList` - Danh sách các giai đoạn
- `DataStaleIndicator` - Thông báo khi data cũ

## 💾 Caching Strategy

### Local Storage
- Journey data được cache trong AsyncStorage
- Cache expiration: 5 phút cho journey data
- Tự động fallback về cached data khi API fail

### Cache Keys
```typescript
STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER_ID: 'userId',
  JOURNEY_CACHE: 'journeyCache',
  // ...
}
```

## 🔄 Data Flow

1. **App Launch**: Load cached data → Show UI → Fetch fresh data in background
2. **User Interaction**: Update local state → Call API → Update cache
3. **Error Handling**: Show cached data if available → Display error message
4. **Refresh**: Force fetch from API → Update cache → Update UI

## 🎯 Usage Examples

### Basic Usage
```typescript
import { useJourneyData } from '../hooks/useJourneyData';

const MyComponent = () => {
  const {
    overview,
    stages,
    loading,
    error,
    refreshData,
    isDataStale
  } = useJourneyData();

  // Component logic here
};
```

### Manual API Calls
```typescript
import JourneyNewService from '../service';

// Get journey overview
const overview = await JourneyNewService.getJourneyOverview();

// Get stage lessons
const lessons = await JourneyNewService.getStageLessons(stageId);

// Submit practice result
await JourneyNewService.submitPracticeHistory({
  lessonType: 'PRACTICE',
  totalQuestions: 10,
  correctAnswers: 8,
  questionAnswers: [...],
  startTime: '2025-01-26T10:00:00Z',
  endTime: '2025-01-26T10:30:00Z'
});
```

## 🚨 Error Handling

### Network Errors
- Tự động retry với exponential backoff
- Fallback về cached data nếu có
- Hiển thị error message với retry button

### Authentication Errors
- Tự động redirect về login screen
- Clear cached tokens
- Show appropriate error message

### Data Validation
- Validate API response structure
- Handle missing or malformed data
- Provide default values where appropriate

## 🔍 Debugging

### Enable Debug Logs
```typescript
// Trong service.ts, thêm console.log để debug
console.log('API Request:', endpoint, options);
console.log('API Response:', response);
```

### Check Cache Status
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Xem cached data
const cached = await AsyncStorage.getItem('journeyCache');
console.log('Cached Journey Data:', JSON.parse(cached));
```

### Network Inspector
- Sử dụng React Native Debugger
- Flipper Network plugin
- Chrome DevTools cho web

## 📊 Performance Optimization

### Lazy Loading
- Load questions chỉ khi cần thiết
- Pagination cho large datasets
- Image lazy loading

### Caching Strategy
- Cache frequently accessed data
- Implement cache invalidation
- Use memory cache for session data

### Bundle Optimization
- Code splitting cho các screens
- Lazy import components
- Optimize images và assets

## 🔐 Security Considerations

### Token Management
- Store tokens securely in AsyncStorage
- Implement token refresh logic
- Clear tokens on logout

### API Security
- Validate all API responses
- Sanitize user inputs
- Use HTTPS only

### Data Privacy
- Don't log sensitive data
- Implement data encryption if needed
- Follow GDPR guidelines

## 🧪 Testing

### Unit Tests
```typescript
// Test service functions
import JourneyNewService from '../service';

test('should fetch journey overview', async () => {
  const overview = await JourneyNewService.getJourneyOverview();
  expect(overview).toBeDefined();
  expect(overview.id).toBeTruthy();
});
```

### Integration Tests
- Test API endpoints với mock server
- Test caching behavior
- Test error scenarios

### E2E Tests
- Test complete user flows
- Test offline scenarios
- Test performance under load

## 📈 Monitoring & Analytics

### Error Tracking
- Implement crash reporting (Sentry, Bugsnag)
- Track API errors và response times
- Monitor cache hit rates

### Performance Metrics
- Track API response times
- Monitor app startup time
- Measure user engagement

### User Analytics
- Track journey completion rates
- Monitor learning progress
- Analyze user behavior patterns

## 🚀 Deployment

### Environment Configuration
```typescript
// Development
API_BASE_URL: 'http://localhost:3000/api'

// Staging
API_BASE_URL: 'https://staging-api.yourapp.com/api'

// Production
API_BASE_URL: 'https://api.yourapp.com/api'
```

### Build Configuration
- Set appropriate API URLs cho từng environment
- Configure caching policies
- Optimize bundle size

## 📞 Support & Troubleshooting

### Common Issues

1. **"User ID not found"**
   - Kiểm tra user đã login chưa
   - Verify AsyncStorage có userId

2. **"API Error: 401"**
   - Token hết hạn hoặc invalid
   - Cần login lại

3. **"Network request failed"**
   - Kiểm tra internet connection
   - Verify API URL đúng

4. **Data không update**
   - Clear cache và refresh
   - Kiểm tra API response

### Debug Checklist
- [ ] API URL configured correctly
- [ ] User authenticated và có token
- [ ] Network connection available
- [ ] Backend server running
- [ ] Database accessible
- [ ] Correct API endpoints

---

**Lưu ý**: Hướng dẫn này sẽ được cập nhật khi có thêm tính năng mới hoặc thay đổi API. 