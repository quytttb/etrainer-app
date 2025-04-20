import request from "@/api/request";
import { getExpoPushToken } from "@/hooks/useExpoPushToken";

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
