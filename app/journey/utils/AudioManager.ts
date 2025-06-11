/**
 * 🎵 Global Audio Manager
 * Quản lý và điều khiển tất cả audio instances trong app
 */

import { Audio } from 'expo-av';

class AudioManager {
     private static instance: AudioManager;
     private activeSounds: Set<Audio.Sound> = new Set();
     private audioPlayerRefs: Set<any> = new Set();

     static getInstance(): AudioManager {
          if (!AudioManager.instance) {
               AudioManager.instance = new AudioManager();
          }
          return AudioManager.instance;
     }

     // Register an audio instance
     registerSound(sound: Audio.Sound) {
          this.activeSounds.add(sound);
          console.log(`🎵 AudioManager: Registered sound. Total active: ${this.activeSounds.size}`);
     }

     // Unregister an audio instance  
     unregisterSound(sound: Audio.Sound) {
          this.activeSounds.delete(sound);
          console.log(`🎵 AudioManager: Unregistered sound. Total active: ${this.activeSounds.size}`);
     }

     // Register an audio player ref
     registerPlayerRef(ref: any) {
          if (ref) {
               this.audioPlayerRefs.add(ref);
               console.log(`🎵 AudioManager: Registered player ref. Total refs: ${this.audioPlayerRefs.size}`);
          }
     }

     // Unregister an audio player ref
     unregisterPlayerRef(ref: any) {
          this.audioPlayerRefs.delete(ref);
          console.log(`🎵 AudioManager: Unregistered player ref. Total refs: ${this.audioPlayerRefs.size}`);
     }

     // ✅ MAIN METHOD: Stop all audio - theo đề xuất của user
     async stopAllAudio() {
          console.log(`🛑 AudioManager: Stopping all audio. Active sounds: ${this.activeSounds.size}, Refs: ${this.audioPlayerRefs.size}`);

          // Method 1: Stop via refs (preferred)
          for (const ref of this.audioPlayerRefs) {
               try {
                    if (ref.current) {
                         if (typeof ref.current.pause === 'function') {
                              await ref.current.pause();
                         }
                         if (typeof ref.current.stop === 'function') {
                              await ref.current.stop();
                         }
                         if (typeof ref.current.reset === 'function') {
                              await ref.current.reset();
                         }
                    }
               } catch (error) {
                    console.error('🚨 Error stopping audio via ref:', error);
               }
          }

          // Method 2: Stop via direct sound instances
          for (const sound of this.activeSounds) {
               try {
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded && status.isPlaying) {
                         await sound.pauseAsync();
                         console.log(`🎵 AudioManager: Paused active sound`);
                    }
               } catch (error) {
                    console.error('🚨 Error stopping active sound:', error);
               }
          }
     }

     // Pause all audio (lighter operation)
     async pauseAllAudio() {
          console.log(`⏸️ AudioManager: Pausing all audio`);

          for (const ref of this.audioPlayerRefs) {
               try {
                    if (ref.current && typeof ref.current.pause === 'function') {
                         await ref.current.pause();
                    }
               } catch (error) {
                    console.error('🚨 Error pausing audio via ref:', error);
               }
          }

          for (const sound of this.activeSounds) {
               try {
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded && status.isPlaying) {
                         await sound.pauseAsync();
                    }
               } catch (error) {
                    console.error('🚨 Error pausing active sound:', error);
               }
          }
     }

     // Get status for debugging
     getStatus() {
          return {
               activeSounds: this.activeSounds.size,
               audioPlayerRefs: this.audioPlayerRefs.size
          };
     }

     // Clear all references (for cleanup)
     clearAll() {
          console.log(`🧹 AudioManager: Clearing all references`);
          this.activeSounds.clear();
          this.audioPlayerRefs.clear();
     }
}

export default AudioManager.getInstance(); 