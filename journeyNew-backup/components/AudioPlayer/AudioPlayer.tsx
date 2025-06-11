import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
     useAnimatedStyle,
     useSharedValue,
     withSpring,
     withRepeat,
     withSequence,
     withTiming,
     Easing
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import AudioManager from '../../utils/AudioManager';

interface AudioPlayerProps {
     audioUrl: string;
     title?: string;
     onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
     autoStopOnChange?: boolean; // ✅ NEW: Auto stop when props change
}

export interface AudioPlayerRef {
     stop: () => Promise<void>;
     pause: () => Promise<void>;
     play: () => Promise<void>;
     isPlaying: () => boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAVEFORM_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side
const WAVEFORM_HEIGHT = 40;
const WAVEFORM_BARS = 30;

const AudioPlayer = React.forwardRef<AudioPlayerRef, AudioPlayerProps>(({
     audioUrl,
     title,
     onPlaybackStatusUpdate,
     autoStopOnChange = true
}, ref) => {
     // Early return if no valid audio URL
     if (!audioUrl || audioUrl.trim() === '') {
          return null;
     }

     const [sound, setSound] = useState<Audio.Sound | null>(null);
     const [isPlaying, setIsPlaying] = useState(false);
     const [duration, setDuration] = useState(0);
     const [position, setPosition] = useState(0);
     const [playbackSpeed, setPlaybackSpeed] = useState(1);
     const [isRepeating, setIsRepeating] = useState(false);
     const [isLoading, setIsLoading] = useState(true);

     // Animation values
     const progress = useSharedValue(0);
     const waveformBars = useSharedValue(Array(WAVEFORM_BARS).fill(0));
     const isAnimating = useSharedValue(false);

     // ✅ FIX: Stop audio when question changes (auto-stop feature)
     useEffect(() => {
          if (autoStopOnChange && sound && isPlaying) {
               console.log('🎵 Auto-stopping audio due to question change');
               sound.pauseAsync();
               setIsPlaying(false);
          }
          loadAudio();
          return () => {
               if (sound) {
                    // ✅ FIX: Unregister từ AudioManager
                    AudioManager.unregisterSound(sound);
                    sound.unloadAsync();
               }
          };
     }, [audioUrl]);

     // ✅ NEW: Expose control methods via ref
     React.useImperativeHandle(ref, () => ({
          stop: async () => {
               if (sound) {
                    await sound.stopAsync();
                    setIsPlaying(false);
                    setPosition(0);
               }
          },
          pause: async () => {
               if (sound && isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
               }
          },
          play: async () => {
               if (sound && !isPlaying) {
                    await sound.playAsync();
                    setIsPlaying(true);
               }
          },
          isPlaying: () => isPlaying,
     }), [sound, isPlaying]);

     // Update progress animation
     useEffect(() => {
          if (duration > 0) {
               progress.value = withTiming(position / duration, {
                    duration: 100,
                    easing: Easing.linear
               });
          }
     }, [position, duration]);

     // Waveform animation
     useEffect(() => {
          if (isPlaying) {
               isAnimating.value = true;
               waveformBars.value = Array(WAVEFORM_BARS).fill(0).map(() =>
                    Math.random() * WAVEFORM_HEIGHT
               );
          } else {
               isAnimating.value = false;
          }
     }, [isPlaying]);

     const loadAudio = async () => {
          try {
               setIsLoading(true);
               const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: false },
                    onPlaybackStatusUpdate
               );
               setSound(newSound);

               // ✅ FIX: Register với AudioManager
               AudioManager.registerSound(newSound);

               // Get duration
               const status = await newSound.getStatusAsync();
               if (status.isLoaded) {
                    setDuration(status.durationMillis || 0);
               }
          } catch (error) {
               console.error('Error loading audio:', error);
          } finally {
               setIsLoading(false);
          }
     };

     const togglePlayback = async () => {
          if (!sound) return;

          try {
               if (isPlaying) {
                    await sound.pauseAsync();
               } else {
                    await sound.setRateAsync(playbackSpeed, true);
                    await sound.playAsync();
               }
               setIsPlaying(!isPlaying);
          } catch (error) {
               console.error('Error toggling playback:', error);
          }
     };

     const changeSpeed = async () => {
          if (!sound) return;

          const speeds = [0.75, 1, 1.25, 1.5];
          const currentIndex = speeds.indexOf(playbackSpeed);
          const nextIndex = (currentIndex + 1) % speeds.length;
          const newSpeed = speeds[nextIndex];

          try {
               await sound.setRateAsync(newSpeed, true);
               setPlaybackSpeed(newSpeed);
          } catch (error) {
               console.error('Error changing speed:', error);
          }
     };

     const toggleRepeat = () => {
          if (!sound) return;
          setIsRepeating(!isRepeating);
          sound.setIsLoopingAsync(!isRepeating);
     };

     const seekTo = async (value: number) => {
          if (!sound) return;
          try {
               const newPosition = value * duration;
               await sound.setPositionAsync(newPosition);
               setPosition(newPosition);
          } catch (error) {
               console.error('Error seeking:', error);
          }
     };

     // Gesture handler for seeking - COMMENTED OUT to avoid GestureHandlerRootView warning
     // const seekGesture = Gesture.Pan()
     //      .onUpdate((event) => {
     //           const newProgress = Math.max(0, Math.min(1, event.translationX / WAVEFORM_WIDTH));
     //           progress.value = newProgress;
     //      })
     //      .onEnd((event) => {
     //           const newProgress = Math.max(0, Math.min(1, event.translationX / WAVEFORM_WIDTH));
     //           seekTo(newProgress);
     //      });

     // Animated styles
     const progressStyle = useAnimatedStyle(() => ({
          width: `${progress.value * 100}%`,
     }));

     const waveformStyle = useAnimatedStyle(() => ({
          opacity: isAnimating.value ? withRepeat(
               withSequence(
                    withTiming(0.5, { duration: 500 }),
                    withTiming(1, { duration: 500 })
               ),
               -1,
               true
          ) : 1,
     }));

     return (
          <View style={styles.container}>
               {title && <Text style={styles.title}>{title}</Text>}

               {/* Waveform Visualization - GESTURE DISABLED */}
               {/* <GestureDetector gesture={seekGesture}> */}
               <View style={styles.waveformContainer}>
                    <Animated.View style={[styles.waveform, waveformStyle]}>
                         {Array(WAVEFORM_BARS).fill(0).map((_, index) => (
                              <View
                                   key={index}
                                   style={[
                                        styles.waveformBar,
                                        {
                                             height: Math.max(10, Math.random() * WAVEFORM_HEIGHT),
                                             backgroundColor: '#E0E0E0'
                                        }
                                   ]}
                              />
                         ))}
                    </Animated.View>
                    <Animated.View style={[styles.progress, progressStyle]} />
               </View>
               {/* </GestureDetector> */}

               {/* Controls */}
               <View style={styles.controls}>
                    <TouchableOpacity
                         style={styles.controlButton}
                         onPress={toggleRepeat}
                    >
                         <FontAwesome
                              name={isRepeating ? "repeat" : "repeat"}
                              size={20}
                              color={isRepeating ? "#4CAF50" : "#666"}
                         />
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={styles.playButton}
                         onPress={togglePlayback}
                         disabled={isLoading}
                    >
                         <FontAwesome
                              name={isPlaying ? "pause" : "play"}
                              size={24}
                              color="#fff"
                         />
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={styles.controlButton}
                         onPress={changeSpeed}
                    >
                         <Text style={styles.speedText}>{playbackSpeed}x</Text>
                    </TouchableOpacity>
               </View>

               {/* Time Display */}
               <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                         {formatTime(position)} / {formatTime(duration)}
                    </Text>
               </View>
          </View>
     );
});

const formatTime = (milliseconds: number): string => {
     const totalSeconds = Math.floor(milliseconds / 1000);
     const minutes = Math.floor(totalSeconds / 60);
     const seconds = totalSeconds % 60;
     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
     container: {
          padding: 16,
          backgroundColor: '#fff',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     title: {
          fontSize: 16,
          fontWeight: '600',
          color: '#333',
          marginBottom: 12,
     },
     waveformContainer: {
          height: WAVEFORM_HEIGHT,
          marginBottom: 16,
          position: 'relative',
     },
     waveform: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
     },
     waveformBar: {
          width: 3,
          backgroundColor: '#E0E0E0',
          borderRadius: 1.5,
     },
     progress: {
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
     },
     controls: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
     },
     controlButton: {
          padding: 12,
     },
     playButton: {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#4CAF50',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 24,
     },
     speedText: {
          fontSize: 14,
          fontWeight: '600',
          color: '#666',
     },
     timeContainer: {
          alignItems: 'center',
     },
     timeText: {
          fontSize: 12,
          color: '#666',
     },
});

export default AudioPlayer; 