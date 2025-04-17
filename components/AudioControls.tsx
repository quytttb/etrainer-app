import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

interface AudioControlsProps {
  audioUri: string;  // Thêm prop audioUri
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioUri }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State để lưu instance âm thanh
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát âm thanh

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
      await sound.setPositionAsync(0); // Tua lại về đầu
    }
  };

  const handleForward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync(); // Lấy trạng thái hiện tại của âm thanh
      if (status.isLoaded) { // Kiểm tra nếu âm thanh đã được tải
        const newPosition = status.positionMillis + 10000; // Tua 10 giây
        await sound.setPositionAsync(newPosition); // Di chuyển vị trí âm thanh
      }
    }
  };

  return (
    <View style={styles.audioControlsContainer}>
      <TouchableOpacity onPress={handleRewind} style={styles.controlButton}>
        <Text style={styles.controlText}>⏪</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
        <Text style={styles.controlText}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForward} style={styles.controlButton}>
        <Text style={styles.controlText}>⏩</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  audioControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  controlButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  controlText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default AudioControls;
