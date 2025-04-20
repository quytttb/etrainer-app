import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { removeExpoPushToken } from "./useExpoPushToken";

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(
      process.env.EXPO_PUBLIC_STORAGE_KEY ?? ""
    );

    return token;
  } catch (error) {
    return null;
  }
};

const setAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(
      process.env.EXPO_PUBLIC_STORAGE_KEY ?? "",
      token
    );
  } catch (error) {
    console.error("Error setting access token:", error);
  }
};

export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_STORAGE_KEY ?? "");
  } catch (error) {
    console.error("Error removing access token:", error);
  }
};

const onLogout = async () => {
  await removeAccessToken();
  await removeExpoPushToken();

  router.push("/auth/login");
};

const useAuth = () => {
  const isAuthenticated = async () => {
    const token = await getAccessToken();

    return !!token;
  };

  return {
    isAuthenticated,
    getAccessToken,
    setAccessToken,
    onLogout,
  };
};

export default useAuth;
