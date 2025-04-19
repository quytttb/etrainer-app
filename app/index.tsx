import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";

export default function IndexRedirect() {
  const params = useLocalSearchParams();

  const { isAuthenticated, setAccessToken } = useAuth();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const isLoggedIn = await isAuthenticated();
    const token = params.token as string;

    if (!isLoggedIn && !token) {
      router.replace("/splash");
      return;
    }

    if (isLoggedIn) {
      router.replace("/(tabs)/home");
      return;
    }

    if (token) {
      await setAccessToken(token);
      router.replace("/(tabs)/home");
    } else {
      router.replace("/splash");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
