import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@EXPO_PUSH_TOKEN";

export const getExpoPushToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEY);

    return token;
  } catch (error) {
    return null;
  }
};

const setExpoPushToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, token);
  } catch (error) {
    console.error("Error setting expo push token:", error);
  }
};

export const removeExpoPushToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error removing expo push token:", error);
  }
};

const useExpoPushToken = () => {
  return {
    setExpoPushToken,
    removeExpoPushToken,
  };
};

export default useExpoPushToken;
