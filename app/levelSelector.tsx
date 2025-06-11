import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { LevelSelector } from "../components/Journey/LevelSelector";
import { useRouter } from "expo-router";

const LevelSelectorDemo: React.FC = () => {
     const router = useRouter();

     const handleJourneyCreated = () => {
          console.log("🎉 Journey created! Navigating back...");
          router.back();
     };

     const handleCancel = () => {
          console.log("❌ Cancelled");
          router.back();
     };

     return (
          <SafeAreaView style={styles.container}>
               <LevelSelector
                    onJourneyCreated={handleJourneyCreated}
                    onCancel={handleCancel}
               />
          </SafeAreaView>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#fff",
     },
});

export default LevelSelectorDemo; 