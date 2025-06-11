import React from "react";
import { View, StyleSheet } from "react-native";
import JourneyNewScreen from "../journeyNew";

export default function JourneyNewTabScreen() {
     return (
          <View style={styles.container}>
               <JourneyNewScreen />
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
}); 