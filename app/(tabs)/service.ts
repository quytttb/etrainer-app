import request from "@/api/request";
import { getExpoPushToken } from "@/utils/getExpoPushToken";

interface ICreateStudyReminder {
  hour: number;
  minute: number;
}

export const setStudyReminderService = async (
  payload: ICreateStudyReminder
) => {
  return request.post("/reminder", {
    ...payload,
    expoPushToken: await getExpoPushToken(),
  });
};

export const getNotificationService = () => {
  return request.get("/notification");
};
