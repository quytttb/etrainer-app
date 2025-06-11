import { useState, useCallback, useEffect } from 'react';
import { TimerState, UseTimerReturn } from '../types';

/**
 * Hook chuyên biệt để quản lý timer cho test mode
 * Cung cấp các chức năng: start, pause, resume, reset, format time
 */
export const useTimer = (
     initialTime: number = 0,
     onTimeUp?: () => void,
     warningThresholds?: number[]
): UseTimerReturn => {
     // ============================================================================
     // STATE MANAGEMENT
     // ============================================================================

     const [timerState, setTimerState] = useState<TimerState>({
          totalTime: initialTime,
          timeRemaining: initialTime,
          timeElapsed: 0,
          isPaused: false,
          isActive: false,
          warnings: []
     });

     // ============================================================================
     // TIMER CONTROL FUNCTIONS
     // ============================================================================

     // Bắt đầu timer
     const start = useCallback(() => {
          setTimerState(prev => ({
               ...prev,
               isActive: true,
               isPaused: false
          }));
          console.log('⏰ Timer started');
     }, []);

     // Tạm dừng timer
     const pause = useCallback(() => {
          setTimerState(prev => ({
               ...prev,
               isPaused: true
          }));
          console.log('⏸️ Timer paused');
     }, []);

     // Tiếp tục timer
     const resume = useCallback(() => {
          setTimerState(prev => ({
               ...prev,
               isPaused: false
          }));
          console.log('▶️ Timer resumed');
     }, []);

     // Reset timer về trạng thái ban đầu
     const reset = useCallback(() => {
          setTimerState({
               totalTime: initialTime,
               timeRemaining: initialTime,
               timeElapsed: 0,
               isPaused: false,
               isActive: false,
               warnings: []
          });
          console.log('🔄 Timer reset');
     }, [initialTime]);

     // Thêm thời gian vào timer (bonus time)
     const addTime = useCallback((milliseconds: number) => {
          setTimerState(prev => ({
               ...prev,
               totalTime: prev.totalTime + milliseconds,
               timeRemaining: prev.timeRemaining + milliseconds
          }));
          console.log(`⏱️ Added ${milliseconds}ms to timer`);
     }, []);

     // ============================================================================
     // TIMER COUNTDOWN EFFECT
     // ============================================================================

     useEffect(() => {
          // Chỉ chạy khi timer active và không bị pause
          if (!timerState.isActive || timerState.isPaused) {
               return;
          }

          const interval = setInterval(() => {
               setTimerState(prev => {
                    const newTimeRemaining = Math.max(0, prev.timeRemaining - 1000);
                    const newTimeElapsed = prev.totalTime - newTimeRemaining;

                    // Check warnings
                    const newWarnings = [...prev.warnings];
                    if (warningThresholds) {
                         warningThresholds.forEach(threshold => {
                              if (newTimeRemaining <= threshold && !newWarnings.includes(threshold)) {
                                   newWarnings.push(threshold);
                                   console.log(`⚠️ Timer warning: ${formatTime(newTimeRemaining)} remaining`);
                              }
                         });
                    }

                    // Check nếu hết thời gian
                    if (newTimeRemaining <= 0 && onTimeUp) {
                         console.log('⏰ Time is up!');
                         onTimeUp();
                    }

                    return {
                         ...prev,
                         timeRemaining: newTimeRemaining,
                         timeElapsed: newTimeElapsed,
                         warnings: newWarnings
                    };
               });
          }, 1000);

          return () => clearInterval(interval);
     }, [timerState.isActive, timerState.isPaused, warningThresholds, onTimeUp]);

     // ============================================================================
     // UTILITY FUNCTIONS
     // ============================================================================

     // Format thời gian thành string dễ đọc (HH:MM:SS hoặc MM:SS)
     const formatTime = useCallback((milliseconds: number): string => {
          const totalSeconds = Math.floor(milliseconds / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          // Nếu có giờ thì hiển thị HH:MM:SS, không thì MM:SS
          if (hours > 0) {
               return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
               return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
     }, []);

     // ============================================================================
     // RETURN HOOK INTERFACE
     // ============================================================================

     return {
          timerState,
          start,
          pause,
          resume,
          reset,
          addTime,
          formatTime
     };
};

export default useTimer; 