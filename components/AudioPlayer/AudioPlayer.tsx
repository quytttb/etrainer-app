import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";

interface AudioPlayerProps {
  audioUri: string;
  autoPlay?: boolean;
}

export interface AudioPlayerRef {
  reset: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
}

interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying?: boolean;
  durationMillis?: number;
  positionMillis?: number;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  ({ audioUri, autoPlay }, ref) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(1);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [seekValue, setSeekValue] = useState<number>(0);

    // Format seconds to mm:ss
    const formatTime = (milliseconds: number): string => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    useEffect(() => {
      const loadSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            {
              uri: audioUri,
            },
            { shouldPlay: autoPlay }
          );
          setSound(sound);
          sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        } catch (error) {
          console.error("Error loading sound:", error);
        }
      };

      loadSound();

      return () => {
        if (sound) {
          sound
            .unloadAsync()
            .catch((err) => console.error("Error unloading sound:", err));
        }
      };
    }, [audioUri]);

    const onPlaybackStatusUpdate = (status: PlaybackStatus) => {
      if (status.isLoaded) {
        setDuration(status.durationMillis || 1);
        if (!isSeeking) {
          if (status.positionMillis !== undefined) {
            setPosition(status.positionMillis);
            setSeekValue(status.positionMillis);
          }
        }
        if (status.isPlaying !== undefined) {
          setIsPlaying(status.isPlaying);
        }
      }
    };

    const togglePlayback = async () => {
      if (!sound) return;

      try {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      } catch (error) {
        console.error("Error toggling playback:", error);
      }
    };

    // Hàm reset
    const resetPlayer = async () => {
      if (sound) {
        try {
          await sound.stopAsync();
          await sound.setPositionAsync(0);
          setIsPlaying(false);
          setPosition(0);
          setSeekValue(0);
        } catch (error) {
          console.error("Error resetting player:", error);
        }
      }
    };

    // Hàm play
    const playAudio = async () => {
      if (sound) {
        try {
          await sound.playAsync();
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    };

    // Hàm pause
    const pauseAudio = async () => {
      if (sound) {
        try {
          await sound.pauseAsync();
        } catch (error) {
          console.error("Error pausing audio:", error);
        }
      }
    };

    // Expose methods to parent through ref
    useImperativeHandle(ref, () => ({
      reset: resetPlayer,
      play: playAudio,
      pause: pauseAudio,
    }));

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <FontAwesome5
            name={isPlaying ? "pause" : "play"}
            size={15}
            color="#FFFFFF"
            style={isPlaying ? {} : { marginLeft: 2 }}
          />
        </TouchableOpacity>

        <Text style={styles.timeText}>{formatTime(position)}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={seekValue}
          minimumTrackTintColor="#0099CC"
          maximumTrackTintColor="#D9D9D9"
          thumbTintColor="#0099CC"
          onValueChange={(value: number) => setSeekValue(value)}
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={async (value: number) => {
            setIsSeeking(false);
            if (sound) {
              try {
                await sound.setPositionAsync(value);
              } catch (error) {
                console.error("Error setting position:", error);
              }
            }
          }}
        />

        <Text style={styles.timeText}>{formatTime(duration - position)}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0099CC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timeText: {
    color: "#555",
    fontSize: 12,
    width: 35,
    textAlign: "center",
    fontWeight: "500",
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 6,
  },
});

export default AudioPlayer;
