import { getExpoPushToken } from "@/utils/getExpoPushToken";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";

const InitialNotification = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();

    const receivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        Alert.alert(
          notification.request.content.title ?? "Thông báo",
          notification.request.content.body ?? "Nội dung thông báo"
        );
      }
    );

    return () => {
      receivedListener.remove();
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    getExpoPushToken();
  };

  return null;
};

export default InitialNotification;
