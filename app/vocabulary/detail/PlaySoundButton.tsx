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

      // Chuẩn hóa url: nếu là từ điển api thì loại bỏ ký tự đặc biệt, viết thường
      let url = audioUrl;
      if (url.includes('dictionaryapi.dev')) {
        const match = url.match(/\/en\/(.+)\.mp3$/);
        if (match && match[1]) {
          const normalized = match[1].toLowerCase().replace(/[^a-z]/g, '');
          url = `https://api.dictionaryapi.dev/media/pronunciations/en/${normalized}.mp3`;
        }
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      setSound(newSound);
    } catch (error) {
      // Có thể show toast hoặc alert nếu muốn
      // console.error("Error playing sound:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.playAudioButton} onPress={playSound}>
      <FontAwesome
        name="volume-up"
        size={16}
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
    backgroundColor: "#0099CC",
    borderRadius: 25,
    padding: 8,
  },
});

export default PlaySoundButton;
