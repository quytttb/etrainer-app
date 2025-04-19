import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Linking from "expo-linking";
import { useMutation } from "@tanstack/react-query";
import request from "@/api/request";

const Callback = () => {
  const loginGoogleMutation = useMutation({
    mutationFn: async (token: string) => {
      const r = await request.post<{ token: string }>("/auth/google", {
        token,
      });

      return r.token;
    },
    onSuccess: async (token) => {
      window.location.href = "exp://localhost:8081/--/?token=" + token;
    },
    onError: () => {
      alert("Đăng nhập thất bại");
    },
  });

  useEffect(() => {
    const getAccessToken = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const fragment = url.split("#")[1];
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const token = params.get("access_token");

          if (token) {
            loginGoogleMutation.mutate(token ?? "");
          }
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
