import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SessionHeaderProps } from '../types';

/**
 * SessionHeader Component - Refactored Layout
 * Header gọn gàng: [Timer] [Pause] [Submit] [Exit]
 * Bỏ progress info (đã có ở navigation dưới)
 */
const SessionHeader: React.FC<SessionHeaderProps & { onSubmit?: () => void }> = ({
     mode,
     showTimer = false,
     timeRemaining = 0,
     isPaused = false,
     progress,
     onPause,
     onResume,
     onExit,
     onSubmit
}) => {
     // ============================================================================
     // HELPERS
     // ============================================================================

     // Format time remaining
     const formatTime = (milliseconds: number): string => {
          const totalSeconds = Math.floor(milliseconds / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
     };

     // Get timer color based on remaining time
     const getTimerColor = (timeMs: number): string => {
          if (timeMs < 5 * 60 * 1000) return '#dc3545'; // < 5 minutes: red
          if (timeMs < 10 * 60 * 1000) return '#fd7e14'; // < 10 minutes: orange
          return '#28a745'; // > 10 minutes: green
     };

     // ============================================================================
     // RENDER
     // ============================================================================

     return (
          <View style={styles.container}>
               {/* Left section: Timer (if enabled) */}
               {showTimer ? (
                    <View style={styles.timerSection}>
                         <View style={[
                              styles.timerContainer,
                              { borderColor: getTimerColor(timeRemaining) }
                         ]}>
                              <Text style={[
                                   styles.timerText,
                                   { color: getTimerColor(timeRemaining) }
                              ]}>
                                   ⏱️ {formatTime(timeRemaining)}
                              </Text>
                              {isPaused && (
                                   <Text style={styles.pausedText}>Tạm dừng</Text>
                              )}
                         </View>
                    </View>
               ) : (
                    <View style={styles.emptySection}>
                         <Text style={styles.modeTitle}>
                              {mode === 'LESSON' ? '📚 Bài học' : '📝 Bài thi'}
                         </Text>
                    </View>
               )}

               {/* Center section: Controls */}
               <View style={styles.controlsSection}>
                    {/* Pause/Resume button */}
                    {onPause && onResume && (
                         <TouchableOpacity
                              style={styles.pauseButton}
                              onPress={isPaused ? onResume : onPause}
                         >
                              <Text style={styles.pauseButtonText}>
                                   {isPaused ? '▶️' : '⏸️'}
                              </Text>
                         </TouchableOpacity>
                    )}

                    {/* Submit button for test mode */}
                    {mode === 'FINAL_TEST' && onSubmit && (
                         <TouchableOpacity
                              style={styles.submitButton}
                              onPress={onSubmit}
                         >
                              <Text style={styles.submitButtonText}>Nộp bài thi</Text>
                         </TouchableOpacity>
                    )}
               </View>

               {/* Right section: Exit button */}
               <View style={styles.exitSection}>
                    <TouchableOpacity
                         style={styles.exitButton}
                         onPress={onExit}
                    >
                         <Text style={styles.exitButtonText}>✕</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
     container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          height: 60, // Fixed height để không che nội dung
     },

     timerSection: {
          flex: 1,
          alignItems: 'flex-start',
     },

     emptySection: {
          flex: 1,
          alignItems: 'flex-start',
     },

     modeTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
     },

     timerContainer: {
          borderWidth: 2,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 4,
          backgroundColor: '#f8f9fa',
     },

     timerText: {
          fontSize: 16,
          fontWeight: '700',
          textAlign: 'center',
     },

     pausedText: {
          fontSize: 10,
          color: '#dc3545',
          textAlign: 'center',
          fontWeight: '600',
          marginTop: 1,
     },

     controlsSection: {
          flex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
     },

     pauseButton: {
          padding: 8,
          borderRadius: 16,
          backgroundColor: '#f8f9fa',
          borderWidth: 1,
          borderColor: '#dee2e6',
          minWidth: 40,
          alignItems: 'center',
     },

     pauseButtonText: {
          fontSize: 12,
     },

     submitButton: {
          backgroundColor: '#28a745',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#1e7e34',
     },

     submitButtonText: {
          fontSize: 14,
          fontWeight: '600',
          color: '#ffffff',
     },

     exitSection: {
          flex: 1,
          alignItems: 'flex-end',
     },

     exitButton: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#f8f9fa',
          borderWidth: 1,
          borderColor: '#dee2e6',
          justifyContent: 'center',
          alignItems: 'center',
     },

     exitButtonText: {
          fontSize: 16,
          fontWeight: '600',
          color: '#666',
     },
});

export default SessionHeader; 