/**
 * 🎵 useAudioCleanup Hook
 * Tự động stop audio khi component unmount hoặc navigation
 */

import React, { useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AudioManager from '../utils/AudioManager';

interface UseAudioCleanupOptions {
     stopOnUnmount?: boolean;
     stopOnNavigateAway?: boolean;
     stopOnSubmit?: boolean;
}

export const useAudioCleanup = (options: UseAudioCleanupOptions = {}) => {
     const {
          stopOnUnmount = true,
          stopOnNavigateAway = true,
          stopOnSubmit = true
     } = options;

     const componentMountedRef = useRef(true);

     // ✅ FIX: Stop audio when component unmounts
     useEffect(() => {
          componentMountedRef.current = true;

          return () => {
               componentMountedRef.current = false;
               if (stopOnUnmount) {
                    console.log('🎵 useAudioCleanup: Stopping audio on unmount');
                    AudioManager.stopAllAudio().catch(console.error);
               }
          };
     }, [stopOnUnmount]);

     // ✅ FIX: Stop audio when navigating away from screen
     useFocusEffect(
          React.useCallback(() => {
               // When screen becomes focused
               console.log('🎵 useAudioCleanup: Screen focused');

               return () => {
                    // When screen loses focus (navigating away)
                    if (stopOnNavigateAway && componentMountedRef.current) {
                         console.log('🎵 useAudioCleanup: Stopping audio on navigate away');
                         AudioManager.stopAllAudio().catch(console.error);
                    }
               };
          }, [stopOnNavigateAway])
     );

     // ✅ Manual stop function for submit/next actions
     const stopAudioOnAction = async (action: string = 'manual') => {
          if (stopOnSubmit) {
               console.log(`🎵 useAudioCleanup: Stopping audio on ${action}`);
               await AudioManager.stopAllAudio();
          }
     };

     return {
          stopAudioOnAction,
          audioManagerStatus: AudioManager.getStatus()
     };
};

export default useAudioCleanup; 