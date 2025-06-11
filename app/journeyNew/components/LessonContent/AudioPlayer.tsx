import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

interface AudioPlayerProps {
     audioUrl: string;
     title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title }) => {
     const [isPlaying, setIsPlaying] = useState(false);
     const [currentTime, setCurrentTime] = useState(0);
     const [duration, setDuration] = useState(0);
     const [isLoading, setIsLoading] = useState(false);

     // Note: This is a basic implementation. In a real app, you would use
     // react-native-sound or expo-av for actual audio playback
     const handlePlayPause = () => {
          if (isLoading) return;

          setIsLoading(true);

          // Simulate loading and playing audio
          setTimeout(() => {
               setIsPlaying(!isPlaying);
               setIsLoading(false);

               // Simulate duration for demo
               if (!isPlaying && duration === 0) {
                    setDuration(30); // 30 seconds mock duration
               }
          }, 500);

          // TODO: Replace with actual audio player implementation
          // Example with expo-av:
          // if (sound) {
          //   if (isPlaying) {
          //     await sound.pauseAsync();
          //   } else {
          //     await sound.playAsync();
          //   }
          // } else {
          //   const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
          //   setSound(sound);
          //   await sound.playAsync();
          // }
     };

     const handleStop = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          // TODO: Stop actual audio playback
     };

     const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins}:${secs.toString().padStart(2, '0')}`;
     };

     const getPlayButtonIcon = () => {
          if (isLoading) return "⏳";
          return isPlaying ? "⏸️" : "▶️";
     };

     const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

     // Simulate progress update when playing
     React.useEffect(() => {
          let interval: NodeJS.Timeout;

          if (isPlaying) {
               interval = setInterval(() => {
                    setCurrentTime(prev => {
                         if (prev >= duration) {
                              setIsPlaying(false);
                              return 0;
                         }
                         return prev + 1;
                    });
               }, 1000);
          }

          return () => {
               if (interval) clearInterval(interval);
          };
     }, [isPlaying, duration]);

     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.audioIcon}>🎧</Text>
                    <View style={styles.titleSection}>
                         <Text style={styles.label}>Audio</Text>
                         {title && <Text style={styles.title}>{title}</Text>}
                    </View>
               </View>

               {/* Progress Bar */}
               <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                         <View
                              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                         />
                    </View>
                    <View style={styles.timeContainer}>
                         <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                         <Text style={styles.timeText}>{formatTime(duration)}</Text>
                    </View>
               </View>

               {/* Controls */}
               <View style={styles.controlsContainer}>
                    <TouchableOpacity
                         style={styles.controlButton}
                         onPress={handleStop}
                         disabled={!isPlaying && currentTime === 0}
                    >
                         <Text style={styles.controlIcon}>⏹️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={[styles.playButton, isLoading && styles.playButtonLoading]}
                         onPress={handlePlayPause}
                         disabled={isLoading}
                    >
                         <Text style={styles.playIcon}>{getPlayButtonIcon()}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={styles.controlButton}
                         onPress={() => Alert.alert("Info", "Audio player cơ bản - sẽ implement đầy đủ với expo-av")}
                    >
                         <Text style={styles.controlIcon}>ℹ️</Text>
                    </TouchableOpacity>
               </View>

               {/* Speed Control (Future feature) */}
               <View style={styles.speedContainer}>
                    <Text style={styles.speedLabel}>Tốc độ: 1x</Text>
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 12,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderLeftWidth: 4,
          borderLeftColor: "#9b59b6",
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
     },
     audioIcon: {
          fontSize: 24,
          marginRight: 12,
     },
     titleSection: {
          flex: 1,
     },
     label: {
          fontSize: 12,
          color: "#7f8c8d",
          fontWeight: "600",
          textTransform: "uppercase",
          marginBottom: 2,
     },
     title: {
          fontSize: 14,
          color: "#2c3e50",
          fontWeight: "500",
     },
     progressContainer: {
          marginBottom: 16,
     },
     progressBar: {
          height: 6,
          backgroundColor: "#ecf0f1",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 8,
     },
     progressFill: {
          height: "100%",
          backgroundColor: "#9b59b6",
          borderRadius: 3,
     },
     timeContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
     },
     timeText: {
          fontSize: 12,
          color: "#7f8c8d",
     },
     controlsContainer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
     },
     controlButton: {
          padding: 12,
          marginHorizontal: 8,
     },
     controlIcon: {
          fontSize: 20,
     },
     playButton: {
          backgroundColor: "#9b59b6",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
     },
     playButtonLoading: {
          backgroundColor: "#bdc3c7",
     },
     playIcon: {
          fontSize: 24,
          color: "#fff",
     },
     speedContainer: {
          alignItems: "center",
     },
     speedLabel: {
          fontSize: 12,
          color: "#7f8c8d",
          fontWeight: "500",
     },
});

export default AudioPlayer; 