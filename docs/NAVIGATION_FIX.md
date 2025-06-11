# Navigation Fix Implementation

## Problem
Android back button (hardware/gesture) was sending users to home screen instead of the previous screen in the app's navigation stack.

## Root Cause
The issue was in `MainActivity.kt` where `invokeDefaultOnBackPressed()` was overridden to force the app to background using `moveTaskToBack(false)` instead of allowing React Native to handle navigation.

## Solution

### 1. MainActivity.kt Fix
```kotlin
// Before (Problematic)
override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
        if (!moveTaskToBack(false)) {
            super.invokeDefaultOnBackPressed()
        }
        return
    }
    super.invokeDefaultOnBackPressed()
}

// After (Fixed)
override fun invokeDefaultOnBackPressed() {
    // Let React Native handle the back button
    super.invokeDefaultOnBackPressed()
}
```

### 2. Global Back Handler Hook
Created `useBackHandler` hook in `/hooks/useBackHandler.ts` to:
- Provide consistent back button handling across the app
- Allow custom back button behavior per screen
- Fall back to proper navigation stack behavior

### 3. Implementation in Components

#### Global App Level
In `app/_layout.tsx`:
```tsx
function AppContent() {
  // Global back handler - will handle back navigation properly
  useBackHandler();
  
  return (
    <>
      <InitialNotification />
      <Slot />
    </>
  );
}
```

#### Screen Level
In individual screens:
```tsx
// With custom behavior (e.g., LessonContent.tsx)
useBackHandler({
  onBackPress: () => {
    setShowExitModal(true);
    return true; // Prevent default back action
  }
});

// With default behavior (e.g., StageDetails.tsx)
useBackHandler({
  onBackPress: () => {
    handleGoBack();
    return true; // Prevent default back behavior
  }
});
```

## Files Modified

1. **Android Native**
   - `/android/app/src/main/java/com/etrainer/myapp/MainActivity.kt`

2. **React Native/TypeScript**
   - `/hooks/useBackHandler.ts` (new)
   - `/components/NavigationWrapper.tsx` (new)
   - `/app/_layout.tsx`
   - `/app/journeyNew/screens/LessonContent.tsx`
   - `/app/journeyNew/screens/StageDetails.tsx`
   - `/app/journeyNew/screens/LessonScreen.tsx`

## How It Works

1. **Hardware Back Button Pressed** → Android system
2. **MainActivity.kt** → Passes to React Native (no longer intercepted)
3. **BackHandler Event** → Caught by useBackHandler hook
4. **Custom Logic Check** → If custom onBackPress provided, execute it
5. **Navigation Decision** → Either custom behavior or proper back navigation
6. **Router.back()** → Uses Expo Router's navigation stack

## Benefits

- ✅ Back button now navigates to previous screen properly
- ✅ Individual screens can override back behavior if needed
- ✅ Audio cleanup and other custom logic supported
- ✅ Consistent behavior across the entire app
- ✅ Proper navigation stack management
- ✅ App only exits when at root level

## Testing

To test the fix:
1. Navigate to a deep screen (e.g., Journey → Stage → Lesson)
2. Press Android back button/gesture
3. Should navigate to previous screen instead of home
4. Continue pressing back until reaching tab navigator
5. At root level, back button should exit app as expected 