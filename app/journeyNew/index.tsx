import React from "react";
import { View, StyleSheet } from "react-native";
import JourneyOverviewScreen from "./screens/JourneyOverview";

const JourneyNewScreen: React.FC = () => {
     return (
          <View style={styles.container}>
               <JourneyOverviewScreen />
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: "#f8f9fa",
     },
});

export default JourneyNewScreen; 