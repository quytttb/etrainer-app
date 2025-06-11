import { useEffect, useRef } from 'react';

interface AudioCleanupOptions {
     stopOnUnmount?: boolean;
     stopOnNavigateAway?: boolean;
     stopOnSubmit?: boolean;
}

interface AudioCleanupHook {
     stopAudioOnAction: (action: string) => Promise<void>;
}

const useAudioCleanup = (options: AudioCleanupOptions = {}): AudioCleanupHook => {
     const audioRef = useRef<any>(null);
     const activeAudios = useRef<Set<any>>(new Set());

     const stopAllAudios = async () => {
          try {
               // Stop all active audio instances
               activeAudios.current.forEach(audio => {
                    if (audio && typeof audio.stopAsync === 'function') {
                         audio.stopAsync().catch(() => { });
                    }
                    if (audio && typeof audio.unloadAsync === 'function') {
                         audio.unloadAsync().catch(() => { });
                    }
               });
               activeAudios.current.clear();
          } catch (error) {
               console.warn('Error stopping audio:', error);
          }
     };

     const stopAudioOnAction = async (action: string): Promise<void> => {
          console.log(`🔇 Stopping audio for action: ${action}`);
          await stopAllAudios();
     };

     // Register audio instance
     const registerAudio = (audio: any) => {
          if (audio) {
               activeAudios.current.add(audio);
          }
     };

     // Unregister audio instance
     const unregisterAudio = (audio: any) => {
          if (audio) {
               activeAudios.current.delete(audio);
          }
     };

     // Cleanup on unmount
     useEffect(() => {
          return () => {
               if (options.stopOnUnmount) {
                    stopAllAudios();
               }
          };
     }, [options.stopOnUnmount]);

     return {
          stopAudioOnAction,
     };
};

export default useAudioCleanup; 