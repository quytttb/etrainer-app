import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface IPlaySoundButtonProps {
  audioUrl: string;
}

const PlaySoundButton = ({ audioUrl }: IPlaySoundButtonProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading sound...");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.playAudioButton} onPress={playSound}>
      <FontAwesome
        name="volume-up"
        size={20}
        color="#fff"
        style={styles.iconLeft}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playAudioButton: {
    position: "absolute",
    left: 15,
    top: 30,
  },
  iconLeft: {
    backgroundColor: "#00BFAE",
    borderRadius: 25,
    padding: 8,
  },
});

export default PlaySoundButton;
