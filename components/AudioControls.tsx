import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for icons
import Slider from '@react-native-community/slider'; // Import Slider for progress bar

interface AudioControlsProps {
  audioUri: string; // Thêm prop audioUri
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUri }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State để lưu instance âm thanh
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát âm thanh
  const [progress, setProgress] = useState(0); // Trạng thái tiến trình âm thanh
  const [duration, setDuration] = useState(0); // Tổng thời gian âm thanh

  // Tải và phát âm thanh khi component được mount
  useEffect(() => {
    const loadAudio = async () => {
      if (sound) {
        await sound.unloadAsync(); // Ensure previous sound is unloaded
        setSound(null); // Reset sound state
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri }, // Use the provided audioUri
        { shouldPlay: false } // Do not auto-play initially
      );
      setSound(newSound);

      // Lấy tổng thời gian âm thanh
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }

      // Lắng nghe tiến trình âm thanh
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.isPlaying) { // Ensure progress updates only when playing
          setProgress(status.positionMillis || 0);
        }
      });
    };

    loadAudio();

    // Cleanup khi component unmount
    return () => {
      if (sound) {
        sound.unloadAsync(); // Cleanup on unmount
      }
    };
  }, [audioUri]); // Add audioUri as a dependency

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync(); // Tạm dừng âm thanh
      } else {
        await sound.playAsync(); // Phát âm thanh
      }
      setIsPlaying(!isPlaying); // Chuyển trạng thái phát/tạm dừng
    }
  };

  const handleRewind = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(0, status.positionMillis - 5000); // Lùi 5 giây
        await sound.setPositionAsync(newPosition);
      }
    }
  };

  const handleForward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(duration, status.positionMillis + 5000); // Tiến 5 giây
        await sound.setPositionAsync(newPosition);
      }
    }
  };

  return (
    <View style={styles.audioControlsContainer}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleRewind} style={styles.controlButton}>
          <FontAwesome name="undo" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
          <FontAwesome name={isPlaying ? "pause" : "play"} size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForward} style={styles.controlButton}>
          <FontAwesome name="repeat" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.progressBar}
        minimumValue={0}
        maximumValue={duration}
        value={progress}
        minimumTrackTintColor="#00BFAE"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#00BFAE"
        onSlidingComplete={async (value) => {
          if (sound) {
            await sound.setPositionAsync(value); // Cập nhật vị trí âm thanh khi kéo thanh trượt
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  audioControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  progressBar: {
    flex: 1,
    marginLeft: 10,
  },
});

export default AudioControls;
