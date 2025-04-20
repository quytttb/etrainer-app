import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";

const InitialNotification = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();

    const receivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📥 Notification received:", notification);
      }
    );

    return () => {
      receivedListener.remove();
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      let token;

      if (Platform.OS !== "android") return;

      await Notifications.cancelAllScheduledNotificationsAsync();

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Thông báo",
          "Bạn cần cấp quyền thông báo để sử dụng tính năng này."
        );
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "bb8d919a-3b3f-4ef6-a29f-150f2ebd9d0b",
        })
      ).data;

      console.log("Expo Push Token:", token);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        `Có lỗi xảy ra khi đăng ký thông báo: ${error.message}`
      );
    }
  };

  return null;
};

export default InitialNotification;
