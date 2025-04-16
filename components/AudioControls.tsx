import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { RotateCcw, RotateCw, Pause } from 'lucide-react-native';

import PropTypes from 'prop-types';

// PropTypes definition for AudioControls
const AudioControlsPropTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onRewind: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
};

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ isPlaying, onPlayPause, onRewind, onForward }) => {
  return (
    <View style={styles.audioControls}>
      <TouchableOpacity onPress={onRewind} style={styles.audioButton}>
        <RotateCcw size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPause} style={styles.audioButton}>
        {isPlaying ? (
          <Pause size={24} color="black" />
        ) : (
          <Text style={styles.playIcon}>▶</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onForward} style={styles.audioButton}>
        <RotateCw size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  audioButton: {
    padding: 10,
    backgroundColor: 'transparent',
    marginHorizontal: 16,
  },
  playIcon: {
    color: 'black',
    fontSize: 24,
  },
});

AudioControls.propTypes = AudioControlsPropTypes;

export default AudioControls;
