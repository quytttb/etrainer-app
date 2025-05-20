import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StageJourney } from "@/components/Journey/StageJourney";

export default function JourneyStudyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Lộ trình học",
          headerStyle: {
            backgroundColor: "#0099CC",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <StageJourney />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
