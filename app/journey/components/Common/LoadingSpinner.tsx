import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingSpinnerProps {
     size?: "small" | "large";
     color?: string;
     text?: string;
     fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
     size = "large",
     color = "#3498db",
     text,
     fullScreen = false,
}) => {
     if (fullScreen) {
          return (
               <View style={styles.fullScreenContainer}>
                    <ActivityIndicator size={size} color={color} />
                    {text && <Text style={styles.loadingText}>{text}</Text>}
               </View>
          );
     }

     return (
          <View style={styles.container}>
               <ActivityIndicator size={size} color={color} />
               {text && <Text style={styles.loadingText}>{text}</Text>}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
     },
     fullScreenContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
     },
     loadingText: {
          marginTop: 12,
          fontSize: 16,
          color: "#7f8c8d",
          textAlign: "center",
     },
});

export default LoadingSpinner; 