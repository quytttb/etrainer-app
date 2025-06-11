/**
 * 🎵 Navigation Audio Helper
 * Utility functions để stop audio khi navigation
 */

import AudioManager from './AudioManager';

export class NavigationAudioHelper {
     // Stop audio với delay ngắn để tránh jarring experience
     static async stopAudioGracefully(delay: number = 50) {
          try {
               if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
               }
               await AudioManager.stopAllAudio();
          } catch (error) {
               console.error('🚨 Error stopping audio gracefully:', error);
          }
     }

     // Stop audio ngay lập tức cho submit
     static async stopAudioImmediate() {
          try {
               await AudioManager.stopAllAudio();
          } catch (error) {
               console.error('🚨 Error stopping audio immediately:', error);
          }
     }

     // Pause audio nhẹ hơn cho navigation
     static async pauseAudioOnNavigation() {
          try {
               await AudioManager.pauseAllAudio();
          } catch (error) {
               console.error('🚨 Error pausing audio on navigation:', error);
          }
     }
}

// ✅ Convenience functions theo đề xuất của user
export const stopAudioOnSubmit = () => NavigationAudioHelper.stopAudioImmediate();
export const stopAudioOnNext = () => NavigationAudioHelper.pauseAudioOnNavigation();
export const stopAudioOnBack = () => NavigationAudioHelper.pauseAudioOnNavigation();
export const stopAudioOnExit = () => NavigationAudioHelper.stopAudioImmediate();

export default NavigationAudioHelper; 