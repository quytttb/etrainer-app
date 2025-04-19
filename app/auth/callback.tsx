import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Linking from "expo-linking";

const Callback = () => {
  useEffect(() => {
    const getAccessToken = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const fragment = url.split("#")[1];
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const token = params.get("access_token");

          window.location.href =
            "exp://localhost:8081/--/auth/login?token=" + token;
        }
      }
    };

    getAccessToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Callback;
