import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ErrorMessageProps {
     message: string;
     onRetry?: () => void;
     retryText?: string;
     fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
     message,
     onRetry,
     retryText = "Thử lại",
     fullScreen = false,
}) => {
     const containerStyle = fullScreen
          ? styles.fullScreenContainer
          : styles.container;

     return (
          <View style={containerStyle}>
               <Text style={styles.errorIcon}>⚠️</Text>
               <Text style={styles.errorMessage}>{message}</Text>
               {onRetry && (
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                         <Text style={styles.retryText}>{retryText}</Text>
                    </TouchableOpacity>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          borderRadius: 12,
          margin: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     fullScreenContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: 40,
     },
     errorIcon: {
          fontSize: 48,
          marginBottom: 16,
     },
     errorMessage: {
          fontSize: 16,
          color: "#e74c3c",
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 24,
     },
     retryButton: {
          backgroundColor: "#3498db",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
     },
     retryText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
     },
});

export default ErrorMessage; 